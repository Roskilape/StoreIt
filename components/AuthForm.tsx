"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import OtpModal from "./OtpModal";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import Link from "next/link";
import { createAccount } from "@/lib/actions/user.action";
import { signInUser } from "@/lib/actions/user.action";

type FormType = "signIn" | "signUp";

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().trim().min(1, "Email is required").email("Invalid email"),

    fullName:
      formType === "signUp"
        ? z.string().trim().min(2).max(50)
        : z.string().trim().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);

  // Define your form schema using Zod
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
    },
  });

  // 2. Define your form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const user =
        type === "signUp"
          ? await createAccount({
              fullName: values.fullName || "",
              email: values.email,
            })
          : await signInUser({ email: values.email });

      if (!user?.accountId) {
        throw new Error("Account not found");
      }

      setAccountId(user.accountId);
    } catch (error: any) {
      setErrorMessage(
        type === "signIn"
          ? error.message === "email is not registered"
            ? "email is not registered, click sign Up and Create new Account"
            : "Failed to sign In. Please try again."
          : error.message === "account already exist"
            ? "email already exist click sign In"
            : "Failed to create an account. Please try again.",
      );
      console.log(error);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "signIn" ? "Sign In" : "Sign Up"}
          </h1>
          {type === "signUp" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col md:flex-row shadow-lg p-4 rounded-sm items-center justify-between">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                  </div>

                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col md:flex-row shadow-lg p-4 rounded-sm items-center justify-between">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Email"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                </div>

                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="form-submit-button text-white"
            onClick={() => setIsSubmitClicked(true)}
          >
            {type === "signIn" ? "Sign In" : "Sign Up"}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="Loading..."
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>
          {errorMessage && <p className="error-message">*{errorMessage}</p>}
          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === "signIn"
                ? "Don't have an account? "
                : "Already have an account? "}
            </p>
            <Link
              href={type === "signIn" ? "/sign-up" : "/sign-in"}
              className="text-brand px-3 hover:text-brand-100"
            >
              {type === "signIn" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>
      {/* OTP VERIFICATION */}
      {accountId && isSubmitClicked && (
        <OtpModal
          email={form.getValues("email")}
          accountId={accountId}
          setAccountId={setAccountId}
        />
      )}
    </>
  );
};

export default AuthForm;
