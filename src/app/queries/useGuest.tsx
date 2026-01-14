import guestApiRequest from "@/apiRequests/guest";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.login,
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.logout,
  });
};

export const useGuestOrderMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.order,
  });
};

export const useGuestGetOrderListMutation = () => {
  return useQuery({
    queryKey: ["guest-orders"],
    queryFn: guestApiRequest.getOrderList,
  });
};
