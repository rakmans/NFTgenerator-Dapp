import { object, string } from "yup";
export const TokenValid = object({
    name: string().required("is required"),
    discreption: string().required("is required"),
});
