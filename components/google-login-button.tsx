"use client";

import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function GoogleLoginButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không nhận được credential từ Google",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.googleLogin(credentialResponse.credential) as any;

      if (result.success) {
        toast({
          title: "Thành công!",
          description: "Đăng nhập Google thành công",
        });
        
        const userData = result.data;
        if (userData && userData.roles && userData.roles.length > 0) {
          const role = userData.roles[0].toLowerCase();
          if (role === 'admin' || role === 'manager') {
            router.push("/admin");
          } else if (role === 'staff') {
            router.push("/staff");
          } else {
            router.push("/dashboard");
          }
        } else {
          router.push("/dashboard");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.message || "Đăng nhập Google thất bại",
        });
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đăng nhập Google thất bại",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast({
      variant: "destructive",
      title: "Lỗi",
      description: "Đăng nhập Google thất bại",
    });
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="outline"
        size="large"
        text="continue_with"
        width="100%"
      />
    </div>
  );
}
