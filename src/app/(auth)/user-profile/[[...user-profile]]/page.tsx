import { UserProfile } from "@clerk/nextjs";

/* const UserProfilePage = () => {
  <main className="w-full h-full flex justify-center items-start">
    <UserProfile path="/user-profile" />
  </main>;
};
 */
// export default UserProfilePage;

export default function UserProfilePage() {
  return (
    <main className="w-full h-full flex justify-center items-start">
      <UserProfile path="/user-profile" />
    </main>
  );
}
