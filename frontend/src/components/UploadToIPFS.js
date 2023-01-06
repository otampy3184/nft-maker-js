import { Web3Storage } from 'web3.storage'
import { Button, Input, Link, TextField } from "@mui/material";

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDEyZUM3OTFBREM0NGYyMmI0ODlmNEYxQTk1ODk2ODM2M0RGRUVGNzAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyMzU4NjIzMTgsIm5hbWUiOiJuZnQtbWFrZXIifQ.ozxz5s4zkcGENyU9kr_pLRK1p4LBgqgGAULJRqcwxcQ";

const UploadToIPFS = (props) => {
    const uploadToIpfs = async (e) => {
        props.setterIsLoading(true)
        const client = new Web3Storage({ token: API_KEY })
        const image = e.target
        console.log("image data:", image)

        const rootCid = await client.put(image.files, {
            name: 'metadata',
            maxRetries: 3
        })

        console.log("root cid:", rootCid)

        await retrive(rootCid)
        props.setterIsLoading(false)
    }

    function makeStorageClient() {
        return new Web3Storage({ token: API_KEY })
    }

    const retrive = async (cid) => {
        const client = makeStorageClient();
        const response = await client.get(cid)
        if (!response.ok) {
            throw new Error("failed to get response")
        }
        const files = await response.files()
        for (const file of files) {
            props.setterResult(file.cid)
            console.log("file.cid:", file.cid)
        }
    }

    return (
        <div>
            <Input className="imageToIpfs" multiple name="imageURL" type="file" accept=".jpg, .png" onChange={uploadToIpfs} />
            {props.result ? (
                <div>
                    <TextField
                        value={props.result}
                        multiline
                        rows={1}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigator.clipboard.writeText(props.result)}
                    >
                        Copy IPFS Link
                    </Button>
                </div>
            ) : null}
        </div>
    )
}

export default UploadToIPFS