import { redirect } from "next/navigation";

export default function Home() {
  //const router = useRouter();
  // const user = localStorage.getItem("authToken");
  // console.log("thanh", user);
  // if (!user)

  redirect("/login");
}
