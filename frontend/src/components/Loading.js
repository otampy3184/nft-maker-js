import React from "react";
import { BallTriangle } from 'react-loader-spinner'

function Loading(props, { inverted = true, content = "Loading..." }) {
    return (
        <div>
            {props.isLoading && (
                < BallTriangle
                    type="Puff"
                    color="#00BFFF"
                    height="40"
                    width="40"
                    timeout={3000}
                />
            )}
        </div>
    )
}

export default Loading;