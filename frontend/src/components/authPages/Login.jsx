import { useContext } from 'react';
import axiosInstance from '../../axios/axios';
import {useNavigate,Link} from 'react-router-dom'
import { UserContext } from '../../context/UserContext';
import toast from 'react-hot-toast';  
 function Login() {
  const navigate = useNavigate()
  const { login } = useContext(UserContext) 

  async function userLogin(e) {
    try {
      e.preventDefault();
      const formData = new FormData(document.getElementById('login-form'));
      const userData = {};
      for (let [key, value] of formData) {
          userData[key] = value;
      }
      const response = await axiosInstance.post('/login', userData);
      const result = response.data;
      login(result.user)
      if (result.user.role==='admin') {
        navigate('/admin')
      }else if(result.user.role==='user'){
        navigate('/')
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    }
}
    return (
      <>
        <div className=" bg-[#F5EBD] h-screen flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src="public/logo-symbol.png"
              className="mx-auto h-20 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              Login 
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form id="login-form" className="space-y-6" onSubmit={userLogin}>
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 white placeholder:white focus:outline focus:outline-2 focus:-outline-offset-2 focus:white sm:text-sm/6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 white placeholder:white focus:outline focus:outline-2 focus:-outline-offset-2 focus:white sm:text-sm/6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-[#af6900ba] px-3 py-1.5 text-sm/6 font-semibold text-[#623D2A] shadow-sm hover:bg-[#af6900] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Log in
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Not a member?{' '}
              <Link to={'/signup'} >
                <span  className="font-semibold text-[#623D2A] hover:text-[#623D2A]">
                  Register Here
                </span>
              </Link>
            </p>
          </div>
        </div>
      </>
    )
  }

  export default Login