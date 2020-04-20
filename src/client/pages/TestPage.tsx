import React, {Fragment} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {createHeadingHook} from "../service/HeadingService";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            display: "inline-flex",
            width: 360,
            overflow: "hidden",
        },
        img: {
            position: "relative",
        }
    }),
);

interface ITestPageProps {

}

function TestPage(props: ITestPageProps): JSX.Element {
    const classes = useStyles();

    //const [heading, refHeading, setHeading] = useRefState<number>(0);
    const heading = Math.round(createHeadingHook()) % 360;
    const width = 360;
    //const offset = width * heading / 360

   /* useEffect(() => {
        setInterval(() => setHeading((refHeading.current + 1) % 360), 10)
    }, []);*/

    return (
        <Fragment>
            <div className={classes.root}>
                <img
                    className={classes.img}
                    src={"/static/images/N.png"}
                    style={{
                        left: 0,
                        width,
                    }}
                    alt={"1"}
                />
                <img
                    className={classes.img}
                    src={"/static/images/W.png"}
                    style={{
                        left: 0,
                        width,
                    }}
                    alt={"2"}
                />
            </div>
            <p>{heading}</p>
        </Fragment>
    );
}

export default TestPage;
