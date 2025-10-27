import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Container,
  Input,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ContactDetails from "./_components/ContactDetails";

const ContactUsForm = () => {
  const formSchema = z.object({
    name: z.string().min(1, { message: "This field has to be filled." }),
    phone: z
      .string()
      .length(10, { message: "Must be exactly 10 characters long" })
      .refine((event) => !/^[0-5]/.test(event), {
        message: "Enter a valid contact number",
      }),
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("Enter a valid email."),
    message: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
  }
  return (
    <div className="relative z-[3] bg-[#F8F4E9] pt-[201px] md:pt-[207px] rounded-b-[20px] md:rounded-b-[64px]">
      <Container maxWidth="lg">
        <Stack
          gap={2}
          justifyContent={"space-between"}
          className="md:flex-row flex-col md:py-[42px] pt-10 pb-[60px]"
        >
          <ContactDetails />
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-start gap-3 bg-[#FFFFFF] px-5 py-[30px] md:p-[50px] rounded-[34px] w-full max-w-full md:max-w-[500px]"
          >
            <Input
              {...form.register("name")}
              disableUnderline
              fullWidth
              placeholder="Name"
              className="border-[#EDE6D4] focus-within:bg-[#EDE6D4] px-[25px] py-4 border rounded-full text-[#231F20] text-[14px]"
            />
            <ErrorMessage
              errors={form.formState.errors}
              name="name"
              render={({ message }) => (
                <Typography className="pl-2 text-red-500 text-sm">
                  {message}
                </Typography>
              )}
            />

            <Input
              {...form.register("phone")}
              disableUnderline
              fullWidth
              placeholder="Mobile Number"
              className="border-[#EDE6D4] focus-within:bg-[#EDE6D4] px-[25px] py-4 border rounded-full text-[#231F20] text-[14px] placeholder:text-[#BFBFBF]"
            />
            <ErrorMessage
              errors={form.formState.errors}
              name="phone"
              render={({ message }) => (
                <Typography className="pl-2 text-red-500 text-sm">
                  {message}
                </Typography>
              )}
            />

            <Input
              {...form.register("email")}
              disableUnderline
              fullWidth
              placeholder="Email"
              className="border-[#EDE6D4] focus-within:bg-[#EDE6D4] px-[25px] py-4 border rounded-full text-[#231F20] text-[14px] placeholder:text-[#BFBFBF]"
            />
            <ErrorMessage
              errors={form.formState.errors}
              name="email"
              render={({ message }) => (
                <Typography className="pl-2 text-red-500 text-sm">
                  {message}
                </Typography>
              )}
            />

            <TextField
              {...form.register("message")}
              sx={{
                border: "1px solid #EDE6D4",
                "& fieldset": { border: "none" },
              }}
              rows={4}
              multiline
              fullWidth
              variant="outlined"
              placeholder="Your message"
              className="rounded-[30px] px-[25px] py-4 focus-within:bg-[#EDE6D4] text-[#231F20] text-[14px] placeholder:text-[#BFBFBF] [&>*]:p-0"
            />

            <ErrorMessage
              errors={form.formState.errors}
              name="message"
              render={({ message }) => (
                <Typography className="pl-2 text-red-500 text-sm">
                  {message}
                </Typography>
              )}
            />

            <Button
              type="submit"
              className="bg-primary hover:bg-primary mt-[18px] px-[46px] py-[14px] rounded-full font-slab font-medium text-[#231F20] text-lg"
            >
              Submit
            </Button>
          </form>
        </Stack>
      </Container>
    </div>
  );
};

export default ContactUsForm;
