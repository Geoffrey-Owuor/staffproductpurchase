import { getCurrentUser } from "@/app/lib/auth";

//Api to check if a valid session cookie still exists
export async function GET(_req) {
  try {
    //check if there is a valid user logged in
    const user = await getCurrentUser();

    if (user?.valid && user?.id) {
      //Session is valid
      return Response.json({ loggedIn: true, userId: user.id });
    } else {
      //Session is invalid
      return Response.json({ loggedIn: false, userId: null });
    }
  } catch (error) {
    //An error during session validation - treated as log out
    console.error("Session validation error:", error);
    return Response.json({ loggedIn: false });
  }
}
