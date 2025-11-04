import axios, { AxiosResponse } from "axios"
import React from "react"
import { toast } from "sonner"


export function useEmail() {
  const [userEmail, setUserEmail] = React.useState<string>("");

  React.useEffect(() => {
        const getTokenDetails = async () => {
            try {
                const response: AxiosResponse = await axios.get("/api/helper");

                const data = response.data;
                if (response.status === 200) {
                    setUserEmail(data.email);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const { status, data } = error.response;

                    if (status === 500) {
                        toast.error(data.error || "Internal Server Error");
                    }
                } else {
                    toast.error("Some unknown error occured");
                }
            }
        }

        getTokenDetails();
    }, []);

  return { userEmail }
}
