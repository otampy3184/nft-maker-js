import { Web3Storage } from 'web3.storage'
import { Input } from "@mui/material";

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDEyZUM3OTFBREM0NGYyMmI0ODlmNEYxQTk1ODk2ODM2M0RGRUVGNzAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyMzU4NjIzMTgsIm5hbWUiOiJuZnQtbWFrZXIifQ.ozxz5s4zkcGENyU9kr_pLRK1p4LBgqgGAULJRqcwxcQ";

const UploadToIPFS = (props) => {
    const uploadToIpfs = async (e) => {
        props.setterIsLoading(true)
        const client = new Web3Storage({ token: API_KEY })
        const image = e.target
        const rootCid = await client.put(image.files, {
            name: 'metadata',
            maxRetries: 3
        })
        await retrive(rootCid)
        props.setterIsLoading(false)
    }

    const retrive = async (cid) => {
        const client = new Web3Storage({ token: API_KEY})
        const response = await client.get(cid)
        if (!response.ok) throw new Error("failed to get response")
        const files = await response.files()
        for (const file of files) {
            props.setterResult(file.cid)
        }
    }

    return (
        <div>
            <Input className="imageToIpfs" multiple name="imageURL" type="file" accept=".jpg, .png" onChange={uploadToIpfs} />
        </div>
    )
}

export default UploadToIPFS