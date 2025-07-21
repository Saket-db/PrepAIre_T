import { integer, json, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const userHistoryTable = pgTable("user_history", {
   id: integer().primaryKey().generatedAlwaysAsIdentity(),
   // FIX: Change the property name to all lowercase to match the database
   eventid: varchar("eventID").notNull(), 
   content: json(),
   userEmail: varchar('userEmail').references(() => usersTable.email).notNull(),
   createdAt: varchar()
});