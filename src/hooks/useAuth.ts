import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../store";
import {
  login,
  register,
  logout,
  getCurrentUser,
  clearError,
  clearSuccess,
} from "../store/slices/auth.slice";
import type { LoginDto, RegisterDto } from "../types/dto.types";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const isVerifying = useSelector((state: RootState) => state.auth.isVerifying);
  const error = useSelector((state: RootState) => state.auth.error);
  // ✓ Keeping this as it might be used by consumers
  const success = useSelector((state: RootState) => state.auth.success);

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const clearNotifications = useCallback(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);

  const handleLogin = useCallback(
    async (data: LoginDto) => {
      setValidationErrors({});
      try {
        const result = await dispatch(login(data)).unwrap();
        navigate("/dashboard");
        return result;
      } catch (error: any) {
        if (error?.errors) {
          setValidationErrors(error.errors);
        }
        throw error;
      }
    },
    [dispatch, navigate],
  );

  const handleRegister = useCallback(
    async (data: RegisterDto) => {
      setValidationErrors({});
      try {
        const result = await dispatch(register(data)).unwrap();
        navigate("/dashboard");
        return result;
      } catch (error: any) {
        if (error?.errors) {
          setValidationErrors(error.errors);
        }
        throw error;
      }
    },
    [dispatch, navigate],
  );

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  // ✓ Memoized to prevent re-renders
  const handleGetCurrentUser = useCallback(async () => {
    return await dispatch(getCurrentUser()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("accessToken");
      if (token && !isAuthenticated) {
        try {
          await dispatch(getCurrentUser()).unwrap();
        } catch {
          const publicPaths = ["/login", "/register"];
          if (!publicPaths.includes(window.location.pathname)) {
            navigate("/login");
          }
        }
      }
    };

    verify();
  }, [dispatch, isAuthenticated, navigate]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isVerifying,
    error,
    success, // ✓ Now returned for consumers
    validationErrors,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearNotifications,
    getCurrentUser: handleGetCurrentUser, // ✓ Memoized
  };
};
