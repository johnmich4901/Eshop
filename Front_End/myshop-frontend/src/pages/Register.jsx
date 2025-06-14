import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import './LogRegi.css'

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/login');
    } catch (error) {
      setErr(error.response?.data?.message || 'Either email exists or password is too short(8)');
    }
  };

  return (
    <div className="form-container">
      <h1>Register</h1>
      {err && <p className="form-error">{err}</p>}
      <form onSubmit={submit}>
        <input type="text" placeholder="Name" name="name"
               value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
        <br/><br/>
        <input type="email" placeholder="Email" name="email"
               value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/>
        <br/><br/>
        <input type="password" placeholder="Password" name="password"
               value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required/>
        <br/><br/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
