import { Box, Card, TextField, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { toast } from "react-toastify";
import { NFTStorage } from "nft.storage";
import { UilExposureIncrease, UilUpload } from "@iconscout/react-unicons";
import { useContext, useState } from "react";
import {
    checkUserConnected,
    checkUserIsOwner,
} from "../../../../helper/transactions";
import { TokenValid } from "../../../../validations/CreateToken";
import NFTContext from "../../../../context/NFTContext";
import CreateTokenShow from "./CreateTokenShow";
import SucceedModal from "./CreateTokenModal";
const CreateToken = () => {
    const [openModal, setOpenModal] = useState(false);
    const [btn, setBtn] = useState(true);
    const [info, setInfo] = useState({
        URl: "",
        ID: "",
    });
    const { isConnected } = useWeb3ModalAccount();
    const { open } = useWeb3Modal();
    const { NFTContract, data } = useContext(NFTContext);
    const [image, setImage] = useState(null);
    const [HaveImg, setHaveImg] = useState(false);
    const API_KEY =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGNiNzFENmNCMUNDZWU5YzBmY0RCNkQ4MzhDQkU5YTRiYjI3RTIxNzYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcxMTYzMjQzNzAwNywibmFtZSI6InJha21hbnMifQ.MpI-Jm8_7BvgNokGyAiVo_UXLbPT8xyQvvK5UICklNM";
    const formik = useFormik({
        initialValues: {
            discreption: "",
            name: "",
        },
        validationSchema: TokenValid,
        onSubmit: (values, { resetForm }) => {
            onclick(values);
            resetForm();
        },
    });

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const img = event.target.files[0];
            if (
                img.type === "image/apng" ||
                img.type === "image/bmp" ||
                img.type === "image/gif" ||
                img.type === "image/jpg" ||
                img.type === "image/png" ||
                img.type === "image/webp" ||
                img.type === "image/svg" ||
                img.type === "image/jpeg"
            ) {
                setHaveImg(true);
            } else {
                setHaveImg(false);
            }
            setImage(img);
        }
    };

    const onclick = async (values) => {
        checkUserConnected(isConnected, open);
        checkUserIsOwner(data.owner);
        if (image === null) {
            throw toast.error("file Not Upload");
        }
        const img = image;
        setImage(null);

        const nft = {
            name: values.name,
            description: values.discreption,
            image: new File([img], img.name, { type: img.type }),
        };
        console.log(nft);
        setBtn(false);
        try {
            const client = new NFTStorage({ token: API_KEY });
            const metadata = await toast.promise(client.store(nft), {
                pending: "saving metadata on ipfs",
                success: "saved on metadata successfully",
                error: "Error",
            });
            NFTContract.once("newNFTMinted", (newItemId) => {
                setInfo({ ID: newItemId, URl: metadata.url });
            });
            const tx = await NFTContract.createToken(metadata.url);
            await toast.promise(tx.wait(), {
                pending: "pending transaction",
                error: "ERROR",
                success: "transaction successfully done!",
            });
            setOpenModal(true);
        } catch (error) {
            toast.error(error.message);
            console.log(error);
            setBtn(true);
        }
        setBtn(true);
    };
    return (
        <Card
            sx={{
                display: "flex",
                width: "98%",
                ml: "1%",
                justifyContent: "center",
                borderRadius: 5,
                mb: 5,
            }}>
            <CreateTokenShow
                file={
                    image === null
                        ? ""
                        : HaveImg === true
                        ? URL.createObjectURL(image)
                        : image.name
                }
                name={formik.values.name}
                description={formik.values.discreption}
                HaveImg={HaveImg}
            />
            <Box width={"52%"}>
                <Box
                    sx={{
                        width: "70%",
                        mt: "15%",
                        ml: "15%",
                        lineHeight: 2,
                        mb: "10%",
                    }}
                    textAlign={"center"}>
                    <UilExposureIncrease size='100' />
                    <Typography variant='h4' mt={2}>
                        Create Token
                    </Typography>
                    <Box component='form' onSubmit={formik.handleSubmit}>
                        <TextField
                            name='name'
                            error={
                                formik.touched.name && formik.errors.name
                                    ? true
                                    : false
                            }
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            helperText={
                                formik.touched.name && formik.errors.name
                                    ? formik.errors.name
                                    : null
                            }
                            fullWidth
                            id='name'
                            label='name'
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            name='discreption'
                            error={
                                formik.touched.discreption &&
                                formik.errors.discreption
                                    ? true
                                    : false
                            }
                            multiline
                            value={formik.values.discreption}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            helperText={
                                formik.touched.discreption &&
                                formik.errors.discreption
                                    ? formik.errors.discreption
                                    : null
                            }
                            id='discreption'
                            label='discreption'
                            sx={{ mt: 2 }}
                            fullWidth
                        />
                        <Button
                            color='secondary'
                            component='label'
                            role={undefined}
                            variant='contained'
                            tabIndex={-1}
                            startIcon={<UilUpload />}
                            sx={{ fontSize: 15, width: "40%", mt: 2 }}>
                            Upload
                            <TextField
                                required
                                name='image'
                                onChange={handleImageChange}
                                onBlur={formik.handleBlur}
                                id='image'
                                sx={{
                                    clip: "rect(0 0 0 0)",
                                    clipPath: "inset(50%)",
                                    height: 1,
                                    overflow: "hidden",
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    whiteSpace: "nowrap",
                                    width: 1,
                                }}
                                inputProps={{
                                    accept: "image/png, image/jpeg , image/gif",
                                }}
                                type='file'
                            />
                        </Button>
                        <Button
                            type='submit'
                            disabled={
                                formik.errors.name ||
                                formik.errors.discreption ||
                                !btn
                                    ? true
                                    : false
                            }
                            variant='contained'
                            sx={{
                                mr: 5,
                                ml: "8.5%",
                                mt: 2,
                                width: "83%",
                                fontSize: 24,
                            }}>
                            Create Token
                        </Button>
                        <SucceedModal
                            onChange={(newOpen) => setOpenModal(newOpen)}
                            open={openModal}
                            TokenID={info.ID.toString()}
                            IPFSURl={info.URl}
                        />
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};
export default CreateToken;
