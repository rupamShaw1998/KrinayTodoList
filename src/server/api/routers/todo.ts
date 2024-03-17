import {
    createTRPCRouter,
    publicProcedure,
  } from "~/server/api/trpc";
  
  
  export const todoRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
      return await ctx.db.todo.findMany();
    }),
  
  });