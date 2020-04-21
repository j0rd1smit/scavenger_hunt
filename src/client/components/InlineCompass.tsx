import React, {Fragment, useEffect} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {createHeadingHook} from "../service/HeadingService";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            width: "100vw",
        },
        canvas: {
        },
        compassContainer: {
            width: "100%",
        }
    }),
);


interface IInlineCompassProps {

}

interface IInlineCompassProps {
    containerWidth: number;
}

function InlineCompass(props: IInlineCompassProps): JSX.Element {
    const classes = useStyles();
    const {containerWidth} = props;
    const height = 58;

    const yOffsetLetters = 35;
    const pixelsLeters = 18;
    const barsize = 25;
    const arrowSize = 36;
    const arrowYOffset = 10;
    const numbersPixels = 18;
    const yOffsetDirectionNumber = 56;

    const heading = Math.round(createHeadingHook()) % 360;
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas === null) {
            return;
        }
        const context = canvas.getContext('2d')
        if (context === null) {
            return;
        }

        const calcXPosition = (degrees: number, widthOfContent: number) => {
            const offset = ((degrees + 90 - heading) % 360 + 360) % 360;
            return containerWidth * offset / 180 - widthOfContent / 2;
        }

        const draw_letter = (letter: string, degrees: number, yOffset: number) =>  {
            const x = calcXPosition(degrees, context.measureText(letter).width);
            context.fillText(letter, x, yOffset);
        }

        const drawCompassLines = () => {
            context.font = `${barsize}px Roboto`;
            context.fillStyle = "rgba(255, 255, 255, 0.5)";
            for (let i = 0; i <= 360; i+= 10) {
                draw_letter("|", i, yOffsetLetters);
            }
        }

        const drawCompassLetters = (): void => {
            context.font = `${pixelsLeters}px Roboto`;
            context.fillStyle = "#FFFFFF";
            draw_letter("W", 270, yOffsetLetters);
            draw_letter("N", 0, yOffsetLetters);
            draw_letter("E", 90, yOffsetLetters);
            draw_letter("S", 180, yOffsetLetters);
        }

        const drawCompassNumbers = (): void => {
            context.font = `${numbersPixels}px Roboto`;
            context.fillStyle = "#FFFFFF";
            const letter = `${heading}°`;
            const x = containerWidth * 0.5 - context.measureText(letter).width / 2
            context.fillText(letter, x, yOffsetDirectionNumber);
        }

        const drawTargetArrow = (): void => {
            const img = new Image();
            img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAH6SURBVHhe7duxTsNAFETRBFHy/z9KSQE7wkuR4NiO3+68F93TOAYk7LmCFEkuAAAAAAAAAACMd12OZXw3y8N/XZvlYQmlLnZr/K5ShLflCBMCmBHAjABmBDAjgBkBzAhgRgAzApgRwIwAZgQwI4AZAcwIYEYAMwKYEcCMAGYEMCOAGQHMCGBGALMhAZZ3sL3/nr2Ej73vyjsqPEC/0Hb4aodXiKDxP/Wg31uk0AC3F9hOq0f4G7+7vcezwgKsXVj7ctUId+N3a/f6jJAAWxfUvl0twur43dY973U6wN4LaT9WJcLm+N3ee38k/En4kQIRdo8f5XSAox+GSBzh8PgRHwQJ+Qt4gQiW8SXsX1DhCLbxJfQ5oGAE6/gS/iRcKIJ9fAkPIAUipBhfhgSQxBHSjC/DAkjCCKnGl6EBJFGEdOPL8ACSIELK8WVKADFGSDu+TAsghgipx5epAWRihPTjy/QAMiFCifHF8ku7NlLYK0tnuMYXawBxR3COL/YA4orgHl9SBJDZETKML2kCyKwIWcaXVAFkdIRM40u6ADIqQrbxJWUAiY6QcXxJG0CiImQdX1IHkLMRMo8v6QPIsxGyjy8lAsjRCBXGlzIBZG+EKuNLqQCyFaHS+FIugKxFqDa+lAwgtxEqjl+eIshyCgAAAAAAAAAAkNDl8gNewCAm3KbxegAAAABJRU5ErkJggg==";
            const location = 10;
            const drawArrow = (): void => {
                const x = calcXPosition(location, arrowSize);
                context.fillStyle = "#FFFFFF";
                context.drawImage(img, x, arrowYOffset, arrowSize, arrowSize);
            }
            drawArrow();
        }

        context.clearRect(0, 0, containerWidth, height);
        drawCompassLines();
        drawCompassLetters();
        drawCompassNumbers();
        drawTargetArrow();
    });

    return (
        <Fragment>
            <canvas
                className={classes.canvas}
                ref={canvasRef}
                height={height}
                width={containerWidth}
            />
        </Fragment>
    );
}

export default InlineCompass;
