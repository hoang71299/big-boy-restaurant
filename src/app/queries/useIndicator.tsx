import indicatorApiRequest from "@/apiRequests/indicator";
import { DashboardIndicatorQueryParamsType } from "@/schemaValidations/indicator.schema";
import { useQuery } from "@tanstack/react-query";

export const useDashBoardIndicator = (
  queryParams: DashboardIndicatorQueryParamsType,
) => {
  return useQuery({
    queryKey: ["indicator", queryParams],
    queryFn: () => indicatorApiRequest.getDashboardIndicator(queryParams),
  });
};
