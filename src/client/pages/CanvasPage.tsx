import React, {Fragment, useEffect} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {createHeadingHook} from "../service/HeadingService";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        canvas: {
        }
    }),
);

interface ICanvasPageProps {

}

function CanvasPage(props: ICanvasPageProps): JSX.Element {
    const classes = useStyles();
    const width = window.innerWidth;

    const yOffsetLetters = 50;
    const pixelsLeters = 64;
    const numbersPixels = 18;

   /* const [heading, refHeading, setHeading] = useRefState<number>(90);


     useEffect(() => {
         setInterval(() => setHeading((refHeading.current + 1) % 360), 10)
     }, []);*/

    const heading = Math.round(createHeadingHook()) % 360;
    const canvasRef = React.useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current;
        // @ts-ignore
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, window.innerHeight, window.innerWidth)



        const draw_letter = (letter: string, degrees: number, yOffset: number) =>  {
            const offset = (heading + degrees + 90) % 360;
            const x = width * offset / 180 - context.measureText(letter).width / 2
            context.fillText(letter, x, yOffset);
        }
        context.font = `${pixelsLeters}px Arial`;
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        for (let i = 0; i <= 360; i+= 10) {
            draw_letter("|", i, yOffsetLetters - 10);
        }

        context.font = `${pixelsLeters}px Arial`;
        context.fillStyle = "#000000";
        draw_letter("W", 270, yOffsetLetters);
        draw_letter("N", 0, yOffsetLetters);
        draw_letter("E", 90, yOffsetLetters);
        draw_letter("S", 180, yOffsetLetters);

        context.font = `${numbersPixels}px Arial`;
        context.fillStyle = "#000000";
        const letter = `${heading}`;
        const x = width * 0.5 - context.measureText(letter).width / 2
        context.fillText(letter, x, 74);

        const img = new Image();
        img.src = "/static/images/arrow.png";
        context.drawImage(img, width / 0.5, 50, pixelsLeters, pixelsLeters);



    });

    return (
        <Fragment>
            <div className={classes.root}>
                <canvas
                    className={classes.canvas}
                    ref={canvasRef}
                    height={1000}
                    width={width}
                />
                <p>{heading}</p>
            </div>
        </Fragment>
    );
}

export default CanvasPage;
