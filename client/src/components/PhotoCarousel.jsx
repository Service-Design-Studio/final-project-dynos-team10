import { selectCurrentComponent } from "../store/workorder/workorderSlice";
import { useSelector } from 'react-redux';

import * as React from 'react';
import { useEffect, useRef, useState, useMemo } from "react";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';


function SwipeableTextMobileStepper() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const components = useSelector(selectCurrentComponent);
  const canvasEls = useRef(new Array());
  const maxSteps = useMemo(() => {
    return components.images.length;
  }, [components]);  

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };


  useEffect(() => {
    // set image sources
    components.images.map((step, index) => {
      console.log(canvasEls.current);
      const canvas = canvasEls.current[index];
      const ctx = canvas.getContext("2d");

      const image = new Image();
      image.onload = function() {
        ctx.drawImage(image, 0, 0);
      };
      image.src = step;
    });

    
  }, [])

  useEffect(() => {
    console.log(canvasEls.current);
  }, [canvasEls.current]);

  const generateCanvases = () => {
    const result = components.images.map((step, index) => {
      console.log(components.images, index);
      return(
        <div>
          <canvas key={index} ref={(element) => canvasEls.current[index] = element}></canvas> 
          {/* {
            Math.abs(activeStep - index) <= 2
            ? (

              // <canvas key={index} ref={(element) => canvasEls.current[index] = element}></canvas> 

              // <canvas className={`canvas__${index}`}></canvas>
            )
            : null
          } */}
        </div>
      )
    })
    console.log({result, refs: canvasEls.current});
    return result;
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
