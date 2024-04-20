import { Box, Typography, useTheme } from "@mui/material";

const CreateTokenShow = ({ name, description, file, HaveImg }) => {
  const theme = useTheme();
  return (
    <>
      <Box
        width={"48%"}
        textAlign={"center"}
        borderRight={`3px solid ${
          theme.palette.mode === "dark" ? "" : "#313552"
        }`}
        display={
          name === "" && description === "" && file === "" ? "none" : "block"
        }
      >
        {HaveImg ? (
          <Box component="img" width="70%" mt={"15%"} src={file} />
        ) : (
          <Typography gutterBottom variant="h6" mt={"15%"} component="div">
            ( {file} )
          </Typography>
        )}
        <Typography gutterBottom variant="h3" mt={5} component="div">
          {name}
        </Typography>
        <Box mb={2}>
          <Typography textAlign={"center"} variant="p">
            {description}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default CreateTokenShow;
