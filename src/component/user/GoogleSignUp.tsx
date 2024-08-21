import { CredentialResponse, GoogleLogin } from "@react-oauth/google"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { googleSignUp } from "../../redux/actions/userAction"
import { isErrorResponse } from "../../utils/customError"

const GoogleSignUp = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isGoogleAuth } = useSelector((state: RootState) => state.user)
  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (credentialResponse?.credential && credentialResponse?.clientId) {
        await dispatch(googleSignUp({ credential: credentialResponse.credential, client_id: credentialResponse.clientId })).unwrap();
      }
    } catch (error) {
      if (isErrorResponse(error)) {
        console.log(error)
      }
    }
  }

  const handleLoginError = () => {
    console.log('Login Failed');
  }

  return (
    <>
      <GoogleLogin width={100} onSuccess={handleLoginSuccess} text={isGoogleAuth ? "continue_with" : 'signin_with'} onError={handleLoginError} />
    </>
  )
}


export default GoogleSignUp