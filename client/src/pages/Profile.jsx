import { FormRow, SubmitBtn } from "../components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { redirect, useOutletContext } from "react-router-dom";
import { Form } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const profileAction =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get("avatar");
    if (file && file.size > 500000) {
      toast.error("Image-size too large!");
      return null;
    }
    try {
      await customFetch.patch(`/users/update-user`, formData);
      queryClient.invalidateQueries(["currentUser"]);
      toast.success("Profile Updated Successfully!");
      return redirect("/dashboard");
    } catch (error) {
      console.log("🔴 ERROR: ", error);
      toast.error(error?.message);
      return null;
    }
  };

function Profile() {
  const { currentUser } = useOutletContext();
  const { name, lastName, email, location } = currentUser;
  return (
    <Wrapper>
      <Form method="post" className="form" encType="multipart/form-data">
        <h4 className="form-title">profile</h4>
        <div className="form-center">
          {/* file input 📂 */}
          <div className="form-row">
            <label htmlFor="avatar" className="form-label">
              Select an image file (max 0.5 mb)
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              className="form-input"
              accept="image/*"
            />
          </div>
          <FormRow type="text" name="name" defaultValue={name} />
          <FormRow
            type="text"
            name="lastName"
            defaultValue={lastName}
            labelTxt="last name"
          />
          <FormRow type="email" name="email" defaultValue={email} />
          <FormRow type="text" name="location" defaultValue={location} />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
}

export default Profile;
