package wastedtime.ch.radiohack;

import android.view.View;
import android.view.animation.Animation;
import android.view.animation.Transformation;


/**
 * Created by Espremea on 15.04.2017.
 * <p>
 * Change the format of a view by modifying its height and width (or one of them only...) over a period of time
 */

public class ResizeAnimation extends Animation {
    private final int mWidth;
    private final int mHeight;
    private final int mStartWidth;
    private final int mStartHeight;
    private final View mView;

    /**
     * @param view
     * @param height set to -1 if not to be changed
     * @param width  set to -1 if not to be changed
     */
    public ResizeAnimation(View view, int height, int width) {
        this(view, height, width, view.getHeight(), view.getWidth());
    }

    /**
     * @param view
     * @param height set to -1 if not to be changed
     * @param width  set to -1 if not to be changed
     */
    public ResizeAnimation(View view, int height, int width, int oldHeight, int oldWidth) {
        mView = view;
        mWidth = width;
        mHeight = height;
        mStartWidth = oldWidth;
        mStartHeight = oldHeight;
    }

    @Override
    protected void applyTransformation(float interpolatedTime, Transformation t) {
        if (mWidth >= 0)
            mView.getLayoutParams().width = mStartWidth + (int) ((mWidth - mStartWidth) * interpolatedTime);

        if (mHeight >= 0)
            mView.getLayoutParams().height = mStartHeight + (int) ((mHeight - mStartHeight) * interpolatedTime);


        mView.requestLayout();
    }

    @Override
    public void initialize(int width, int height, int parentWidth, int parentHeight) {
        super.initialize(width, height, parentWidth, parentHeight);
    }

    @Override
    public boolean willChangeBounds() {
        return true;
    }
}