import { selectCurrentComponent } from "../store/workorder/workorderSlice";
import { useSelector } from 'react-redux';

import * as React from 'react';
import { useEffect, useRef, useState, useMemo } from "react";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';


function SwipeableTextMobileStepper({
  activeStep,
  handleNext,
  handleBack,
  handleStepChange
}) {
  const theme = useTheme();

  const components = useSelector(selectCurrentComponent);
  const maxSteps = useMemo(() => {
    return components.images.length;
  }, [components]);

  const canvasEls = useRef([]);
  const [canvasReady, setCanvasReady] = useState(false);
  const [canvasIntervalId, setCanvasIntervalId] = useState(0);
  const setImages = () => {
    // set image sources
    components.images.map((step, index) => {
      const canvas = canvasEls.current[index];
      const ctx = canvas.getContext("2d");

      const image = new Image();
      image.onload = function() {
        ctx.drawImage(image, 0, 0);
      };
      image.src = step;
    });
  }
  const delaySetImages = () => {
    const intervalId = setInterval(() => {
      if (canvasEls.current.length === maxSteps) {
        setCanvasReady(true);
      }
    }, 200);
    setCanvasIntervalId(intervalId);
  }
  useEffect(() => {
    delaySetImages();

    if (canvasReady) {
      clearInterval(canvasIntervalId);
      setImages();
    }
  }, [canvasReady])
  // useEffect(() => {
  //   setImages();
  // }, [components.images])

  const generateCanvases = () => {
    return components.images.map((step, index) => {
      return (
          <canvas key={index} ref={(element) => canvasEls.current[index] = element}></canvas> 
          // {
          //   Math.abs(activeStep - index) <= 2
          //   ? (

          //     <canvas key={index} ref={(element) => canvasEls.current[index] = element}></canvas> 

          //     // <canvas className={`canvas__${index}`}></canvas>
          //   )
          //   : null
          // }
      )
    })
  }


  return (
    <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
      <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
          pl: 2,
          bgcolor: 'background.default',
        }}
      >
      </Paper>

      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {generateCanvases()}
      </SwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
    </Box>
  );
}

export default SwipeableTextMobileStepper;
