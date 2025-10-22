import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('email'), args.email))
      .first();

    if (existingUser) {
      return existingUser._id; // Return existing user ID
    }

    // Create new user with 50,000 credits
    const userId = await ctx.db.insert('users', {
      name: args.name,
      email: args.email,
      credits: 50000, // ✅ 50,000 FREE CREDITS
    });

    return userId; // Return new user ID
  },
});

// Update user credits
export const UpdateUserToken = mutation({
  args: {
    id: v.id('users'),
    credits: v.number()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      credits: args.credits
    });
  }
});

// Get user by ID
export const GetUserById = query({
  args: {
    id: v.id('users')
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    return user;
  }
});

// Get user by email (useful for checking existing users)
export const GetUserByEmail = query({
  args: {
    email: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('email'), args.email))
      .first();
    return user;
  }
});
