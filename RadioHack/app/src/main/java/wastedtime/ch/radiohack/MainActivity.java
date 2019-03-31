package wastedtime.ch.radiohack;

import android.graphics.Point;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Display;
import android.view.View;
import android.view.animation.Animation;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import static android.view.ViewGroup.LayoutParams.WRAP_CONTENT;
import static android.view.Window.FEATURE_NO_TITLE;

public class MainActivity extends AppCompatActivity {
    private final static float MAX_HEIGHT_BAR_CHART = 0.3f;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.requestWindowFeature(FEATURE_NO_TITLE);
        getSupportActionBar().hide();
        setContentView(R.layout.activity_main);

        FirebaseDatabase database = FirebaseDatabase.getInstance();
        DatabaseReference myRef = database.getReference("message");

        myRef.setValue("Hello, World!");

        // Read from the database
        myRef.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                // This method is called once with the initial value and again
                // whenever data at this location is updated.
                String value = dataSnapshot.getValue(String.class);
                Log.d("TAG", "Value is: " + value);
            }

            @Override
            public void onCancelled(DatabaseError error) {
                // Failed to read value
                Log.e("TAG", "Failed to read value.", error.toException());
            }
        });

        Button playPauseButton = findViewById(R.id.playbutton);
        boolean[] isPlaying = new boolean[]{true};
        playPauseButton.setOnClickListener(view -> {
            if (isPlaying[0]) {
                playPauseButton.setBackground(getDrawable(R.drawable.pause_button));
            } else {
                playPauseButton.setBackground(getDrawable(R.drawable.play_button));
            }
            isPlaying[0] = !isPlaying[0];
        });

        TextView radioTitle = findViewById(R.id.radio_title);
        TextView songTitle = findViewById(R.id.song_title);
        TextView artistView = findViewById(R.id.artist);
        ImageView background = findViewById(R.id.background);

        //Background
        boolean[] displayingPoll = new boolean[]{false};
        Display display = getWindowManager().getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        int width = size.x;
        int height = size.y;
        View bottom = findViewById(R.id.bottom);
        DownloadImageFromInternet backgroundUrl = new DownloadImageFromInternet(background, height, width);
        background.setOnClickListener(v -> hidePoll());

        DatabaseReference radio = database.getReference("RadioAct/now_on_air");
        radio.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {

                String album = dataSnapshot.child("album").getValue(String.class);
                String art = dataSnapshot.child("art").getValue(String.class);
                String artist = dataSnapshot.child("artist").getValue(String.class);
                String song = dataSnapshot.child("song").getValue(String.class);


                //Log.d("TAG", "Value is: " + value);
                radioTitle.setText("RadioAct");
                songTitle.setText(song);
                artistView.setText(artist);

                backgroundUrl.execute(art);
            }

            @Override
            public void onCancelled(DatabaseError error) {
                // Failed to read value
                Log.e("TAG", "Failed to read value.", error.toException());
            }
        });

        DatabaseReference poll = database.getReference("RadioAct/polls");
        poll.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                // This method is called once with the initial value and again
                // whenever data at this location is updated.
                String active_poll = dataSnapshot.child("active_poll").getValue(String.class);
                boolean display_results = dataSnapshot.child("display_results").getValue(Boolean.class);

                if (!display_results && (active_poll == null || !active_poll.isEmpty())) {
                    database.getReference("RadioAct/polls/" + active_poll).addListenerForSingleValueEvent(new ValueEventListener() {
                        @Override
                        public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                            displayingPoll[0] = true;
                            boolean[] voted = new boolean[]{false};

                            bottom.setVisibility(View.INVISIBLE);
                            bottom.getLayoutParams().height = WRAP_CONTENT;
                            findViewById(R.id.vote_view).setVisibility(View.VISIBLE);

                            Button voteA = findViewById(R.id.vote_a);
                            voteA.setOnClickListener(addVoteEvent(active_poll, 0, voted));
                            Button voteB = findViewById(R.id.vote_b);
                            voteB.setOnClickListener(addVoteEvent(active_poll, 1, voted));
                            Button voteC = findViewById(R.id.vote_c);
                            Button voteD = findViewById(R.id.vote_d);
                            if (dataSnapshot.child("choices/2").exists()) {
                                voteC.setVisibility(View.VISIBLE);
                                voteC.setOnClickListener(addVoteEvent(active_poll, 2, voted));
                            } else {
                                voteC.setVisibility(View.GONE);
                            }
                            if (dataSnapshot.child("choices/3").exists()) {
                                voteD.setVisibility(View.VISIBLE);
                                voteD.setOnClickListener(addVoteEvent(active_poll, 3, voted));
                            } else {
                                voteD.setVisibility(View.GONE);
                            }


                            bottom.post(() -> {
                                //bottom.setVisibility(View.VISIBLE);
                                TextView pollQuestion = findViewById(R.id.poll_text);
                                pollQuestion.setText(dataSnapshot.child("name").getValue(String.class));

                                findViewById(R.id.results_view).setVisibility(View.GONE);
                                playPauseButton.setVisibility(View.GONE);
                                TextView titleBottom = findViewById(R.id.bottomTitle);
                                titleBottom.setText("NEW POLL");
                                titleBottom.setVisibility(View.VISIBLE);

                                int h = bottom.getHeight();
                                Animation anim = new ResizeAnimation(bottom, bottom.getHeight(), -1, 0, -1);
                                anim.setDuration(500);
                                bottom.startAnimation(anim);
                            });
                        }

                        @Override
                        public void onCancelled(@NonNull DatabaseError databaseError) {

                        }
                    });
                } else if (display_results) {
                    database.getReference("RadioAct/poll_answers/" + active_poll).addListenerForSingleValueEvent(new ValueEventListener() {
                        @Override
                        public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                            bottom.setVisibility(View.INVISIBLE);
                            bottom.getLayoutParams().height = WRAP_CONTENT;

                            View resultsView = findViewById(R.id.results_view);
                            resultsView.setVisibility(View.VISIBLE);
                            String question = dataSnapshot.child("name").getValue(String.class);
                            TextView questionView = findViewById(R.id.results_text);
                            questionView.setText(question);
                            questionView.post(() -> {
                                resultsView.getLayoutParams().height = (int) (MAX_HEIGHT_BAR_CHART * height)
                                        + questionView.getHeight()
                                        + findViewById(R.id.results_text_vote_a).getHeight();

                                bottom.requestLayout();
                                bottom.post(()->{
                                    //bottom.setVisibility(View.VISIBLE);
                                    TextView titleBottom = findViewById(R.id.bottomTitle);
                                    titleBottom.setText("RESULTS");
                                    titleBottom.setVisibility(View.VISIBLE);
                                    playPauseButton.setVisibility(View.GONE);
                                    findViewById(R.id.vote_view).setVisibility(View.GONE);

                                    Animation anim = new ResizeAnimation(bottom, bottom.getHeight(), -1, 0, -1);
                                    anim.setDuration(500);
                                    bottom.startAnimation(anim);
                                });

                            });


                            int totalVotes = 0;
                            int countA = dataSnapshot.child("votes/0").getValue(Integer.class);
                            int countB = dataSnapshot.child("votes/1").getValue(Integer.class);
                            totalVotes += countA + countB;
                            int countC = -1;
                            if (dataSnapshot.child("votes/2").exists()) {
                                countC = dataSnapshot.child("votes/2").getValue(Integer.class);
                                totalVotes += countC;
                            }
                            int countD = -1;
                            if (dataSnapshot.child("votes/3").exists()) {
                                countD = dataSnapshot.child("votes/3").getValue(Integer.class);
                                totalVotes += countD;
                            }

                            int max = Math.max(Math.max(countA, countB), Math.max(countC, countD));
                            findViewById(R.id.results_bar_vote_a).getLayoutParams().height = (int) (MAX_HEIGHT_BAR_CHART * height * countA / max);
                            findViewById(R.id.results_bar_vote_b).getLayoutParams().height = (int) (MAX_HEIGHT_BAR_CHART * height * countB / max);
                            RelativeLayout resultsC = findViewById(R.id.results_vote_c);
                            if (countC > -1) {
                                resultsC.setVisibility(View.VISIBLE);
                                findViewById(R.id.results_bar_vote_c).getLayoutParams().height = (int) (MAX_HEIGHT_BAR_CHART * height * countC / max);
                            } else {
                                resultsC.setVisibility(View.GONE);
                            }
                            RelativeLayout resultsD = findViewById(R.id.results_vote_d);
                            if (countD > -1) {
                                resultsD.setVisibility(View.VISIBLE);
                                findViewById(R.id.results_bar_vote_d).getLayoutParams().height = (int) (MAX_HEIGHT_BAR_CHART * height * countD / max);
                            } else {
                                resultsD.setVisibility(View.GONE);
                            }
                        }

                        @Override
                        public void onCancelled(@NonNull DatabaseError databaseError) {

                        }
                    });
                } else {
                    hidePoll();
                }
            }

            @Override
            public void onCancelled(DatabaseError error) {
                // Failed to read value
                Log.e("TAG", "Failed to read value.", error.toException());
            }
        });

    }

    public void hidePoll() {
        View bottom = findViewById(R.id.bottom);
        int heightBottom = bottom.getHeight();
        if (heightBottom == 0) {
            bottom.setVisibility(View.GONE);
            findViewById(R.id.playbutton).setVisibility(View.VISIBLE);
            findViewById(R.id.results_view).setVisibility(View.GONE);
            findViewById(R.id.vote_view).setVisibility(View.GONE);
            findViewById(R.id.bottomTitle).setVisibility(View.GONE);
        } else {
            Animation anim = new ResizeAnimation(bottom, 0, -1);
            anim.setDuration(500);
            bottom.postOnAnimationDelayed(() -> {
                bottom.setVisibility(View.GONE);
                bottom.getLayoutParams().height = WRAP_CONTENT;
                findViewById(R.id.playbutton).setVisibility(View.VISIBLE);
                findViewById(R.id.results_view).setVisibility(View.GONE);
                findViewById(R.id.vote_view).setVisibility(View.GONE);
                findViewById(R.id.bottomTitle).setVisibility(View.GONE);
            }, 505);
            bottom.startAnimation(anim);
        }
    }

    public View.OnClickListener addVoteEvent(String pollId, int id, boolean[] voted) {
        return view -> {
            if (!voted[0]) {
                voted[0] = true;

                //TODO CHECK CONNECTIVITY
                new CallAPI().execute("https://us-central1-test-rhe.cloudfunctions.net/vote", "" + pollId, "" + id);
                hidePoll();
            }
        };
    }
}
