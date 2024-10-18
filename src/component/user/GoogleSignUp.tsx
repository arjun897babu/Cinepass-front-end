import { CredentialResponse, GoogleLogin } from "@react-oauth/google"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { googleSignUp } from "../../redux/actions/userAction"
import {isResponseError } from "../../utils/customError"
import { Toast } from "../Toast2"
import { ResponseStatus } from "../../interface/Interface"

const GoogleSignUp: React.FC<{ handleToastMessage: (toast: Toast) => void }> = ({ handleToastMessage }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { isGoogleAuth } = useSelector((state: RootState) => state.user)
  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (credentialResponse?.credential && credentialResponse?.clientId) {
        await dispatch(googleSignUp({ credential: credentialResponse.credential, client_id: credentialResponse.clientId })).unwrap();
      }
    } catch (error) {
      if (isResponseError(error)) {
        if (error.statusCode === 403) {
          handleToastMessage(
            {
              alert: ResponseStatus.ERROR,
              message: error.data.message
            }
          )
        }
        if (error.statusCode === 500) {
          handleToastMessage(
            {
              alert: ResponseStatus.ERROR,
              message: error.data.message
            }
          )
        }
      }
    }
  }

  const handleLoginError = () => {
    handleToastMessage(
      {
        alert: ResponseStatus.ERROR,
        message: 'something went wrong'
      }
    )
  }

  return (
    <>
      <GoogleLogin width={100} onSuccess={handleLoginSuccess} text={isGoogleAuth ? "continue_with" : 'signin_with'} onError={handleLoginError} />
    </>
  )
}


export default GoogleSignUp