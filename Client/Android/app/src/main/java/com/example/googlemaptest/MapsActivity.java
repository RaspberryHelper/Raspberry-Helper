package com.example.googlemaptest;

import android.support.v4.app.FragmentActivity;
import android.os.Bundle;
import android.util.Log;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

import android.app.Activity;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;

import org.json.JSONObject;

import java.util.ArrayList;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback {

    private ListView mList;
    private ArrayList<String> arrayList;
    public static TCPClient mTcpClient;
    JSONObject personJson = new JSONObject();
    Button send;

    private GoogleMap mMap;
    LatLng sydney;
    Bundle b;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);
        arrayList = new ArrayList<String>();
        new connectTask().execute("");
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.

        b = new Bundle();
        b = getIntent().getExtras();
        Log.d("onCre", "cre");

        send = (Button)findViewById(R.id.send_button);

        sydney  = new LatLng(b.getFloat("1"), b.getFloat("2"));
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);

        send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                /////////////////////////////////////////

                try {
                    Log.d("bubububububububu", "asd0");

                    personJson.put("type", "andRequest");
                    personJson.put("request", "ok");
                    personJson.put("username", "help");
                    if (mTcpClient != null) {
                        Log.d("tcp", "tcp");
                        mTcpClient.sendMessage(personJson.toString());
                    }
                } catch (Exception e) {
                    Log.e("ERROR", "login json err", e);
                }
            }
        });
    }


    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {

        mMap = googleMap;
        mMap = ((SupportMapFragment)getSupportFragmentManager().findFragmentById(R.id.map)).getMap();

        Log.d("onMap", "map");
        // Add a marker in Sydney and move the camera
        mMap.setBuildingsEnabled(false);
        mMap.addMarker(new MarkerOptions().position(sydney).title("Marker in Sydney"));
        LatLng startingPoint = new LatLng(b.getFloat("1"), b.getFloat("2"));

        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(startingPoint,16));
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    @Override
    protected void onStop() {
        super.onStop();
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