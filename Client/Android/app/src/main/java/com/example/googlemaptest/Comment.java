package com.example.googlemaptest;

import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import org.json.JSONObject;

import java.util.ArrayList;

public class Comment extends AppCompatActivity {
    private ArrayList<String> arrayList;
    public static TCPClient mTcpClient;
    JSONObject personJson = new JSONObject();
    Button send;
    EditText text;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_comment);
        new connectTask().execute("");

        arrayList = new ArrayList<String>();
        send = (Button) findViewById(R.id.button);
        text = (EditText) findViewById(R.id.EditText);
        text.setCompoundDrawables(null,null,getResources().getDrawable(R.drawable.textbox),null);

        send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                /////////////////////////////////////////

                try {
                    personJson.put("type", "andResponse");
                    personJson.put("content", text.getText().toString());
                    Log.d("tcp", "tcp");
                    if (mTcpClient != null) {
                        Log.d("tcp", "tcp");
                        mTcpClient.sendMessage(personJson.toString());
                    }
                } catch (Exception e) {
                    Log.e("ERROR", "sending text json err", e);
                }
            }
        });
    }
    public TCPClient getTcpClient() {
        return mTcpClient;
    }

    public class connectTask extends AsyncTask<String,String,TCPClient> {

        @Override
        protected TCPClient doInBackground(String... message) {

            //we create a TCPClient object and
            mTcpClient = new TCPClient(new TCPClient.OnMessageReceived() {
                @Override
                //here the messageReceived method is implemented
                public void messageReceived(String message) {
                    //this method calls the onProgressUpdate
                    publishProgress(message);
                }
            });
            mTcpClient.run();

            return null;
        }

        @Override
        protected void onProgressUpdate(String... values) {
            super.onProgressUpdate(values);

            //in the arrayList we add the messaged received from server
            arrayList.add(values[0]);
            // notify the adapter that the data set has changed. This means that new message received
            // from server was added to the list
        }
    }
}