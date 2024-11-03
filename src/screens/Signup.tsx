import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../utils/backendUrl';
import { useUser } from '../Providers/Socket';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //@ts-ignore
  const { setUser } = useUser();
//@ts-ignore
  const handleSignup = async (e) => {
    try {
      e.preventDefault();
      const resp = await axios.post(`${BACKEND_URL}/app/user/signup`, {
        username, password, email
      }, { withCredentials: true });
      console.log(resp.data.message);
      setUser(resp.data.user);
      navigate("/");
    } catch (error) {
      //@ts-ignore
      console.log(error.response.data.message)
      //@ts-ignore
      alert(error.response.data.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up for an account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input id="name" name="name" type="text" autoComplete="name" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-2" placeholder="Name" onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-2" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Signup today
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">Already have an account? <span className="text-indigo-600 cursor-pointer" onClick={() => navigate("/login")}>Log in</span></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
