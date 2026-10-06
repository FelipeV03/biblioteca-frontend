import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, listUsers, type UserInput } from "@/lib/api/users";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: listUsers,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UserInput) => createUser(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}
