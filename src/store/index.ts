// frontend-company/src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import dashboardReducer from "./slices/dashboard.slice";
import applicationsReducer from "./slices/applications.slice";
import jobsReducer from "./slices/jobs.slice";
import companyReducer from "./slices/company.slice";
// ✅ Import the new slices
import candidatesReducer from "./slices/candidates.slice";
import aiReducer from "./slices/ai.slice";
import notificationsReducer from "./slices/notifications.slice";
import { NODE_ENV } from "../config/env";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    applications: applicationsReducer,
    jobs: jobsReducer,
    company: companyReducer,
    candidates: candidatesReducer,
    ai: aiReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
        ignoredActionPaths: ["payload.createdAt", "payload.updatedAt"],
        ignoredPaths: ["auth.user.createdAt", "auth.user.updatedAt"],
      },
    }),
  devTools: NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
