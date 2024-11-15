import { header, request } from "@/utilities/request";

interface ProfilePayload {
  name: string;
  phone: string;
  email: string;
  gender: string;
}

export const setProfile = async (payload: ProfilePayload) => {
  try {
    const formData = new FormData();
    const requestURL = `/api/v1/user/profile/update`;
    formData.append("name", payload.name);
    formData.append(
      "phone",
      payload.phone.startsWith("+91") ? payload.phone : `+91${payload.phone}`
    );
    formData.append("email", payload.email);
    formData.append("gender", payload.gender);

    formData.append("client_id", process.env.NEXT_PUBLIC_CLIENT_ID || "");
    formData.append(
      "client_secret",
      process.env.NEXT_PUBLIC_CLIENT_SECRET || ""
    );

    const response = await request(requestURL, {
      method: "POST",
      headers: {
        Authorization: header(),
        Accept: "application/json",
      },
      body: formData,
    });

    return response;
  } catch (e) {
    //
  }
};
