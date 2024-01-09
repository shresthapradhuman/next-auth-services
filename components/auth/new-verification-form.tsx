"use client";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import FormError from "@/components/form-error";
import FormSuccess from "../form-success";

const NewVerificationForm = () => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const onSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("Missing token");
      return;
    }
    newVerification(token)
      .then((data) => {
        setSuccess(data?.success as string);
        setError(data?.error as string);
      })
      .catch(() => {
        setError("Something went wrong");
      });
  }, [error, success, token]);
  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <CardWrapper
      headerLabel="Confirm your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center justify-center w-full">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
