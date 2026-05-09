export default function HogiPayAuth() { const urlParams = new URLSearchParams(window.location.search); const referral = urlParams.get('ref') || '';

return ( <div className="min-h-screen bg-[#1E1B4B] flex items-center justify-center p-4"> <div className="w-full max-w-md bg-[#241F5A] rounded-3xl shadow-2xl p-6 text-white"> <div className="flex justify-center mb-6"> <div className="bg-white text-[#3B2EFF] font-extrabold text-5xl px-8 py-4 rounded-xl shadow-lg"> HOGI PAY </div> </div>

<div className="tabs flex gap-3 mb-6">
      <button
        onClick={() => document.getElementById('loginTab').style.display='block' || (document.getElementById('signupTab').style.display='none')}
        className="flex-1 bg-purple-600 py-3 rounded-xl font-semibold hover:scale-105 transition"
      >
        Login
      </button>

      <button
        onClick={() => document.getElementById('signupTab').style.display='block' || (document.getElementById('loginTab').style.display='none')}
        className="flex-1 bg-pink-600 py-3 rounded-xl font-semibold hover:scale-105 transition"
      >
        Sign Up
      </button>
    </div>

    {/* LOGIN */}
    <div id="loginTab">
      <h2 className="text-2xl font-bold mb-5">Login Account</h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm">Mobile Number</label>
        <div className="flex bg-[#312B70] rounded-xl overflow-hidden">
          <select className="bg-transparent px-3 outline-none text-white">
            <option value="+92">🇵🇰 +92</option>
            <option value="+91">🇮🇳 +91</option>
            <option value="+971">🇦🇪 +971</option>
            <option value="+1">🇺🇸 +1</option>
          </select>
          <input
            type="tel"
            placeholder="Enter mobile number"
            className="w-full bg-transparent px-4 py-4 outline-none"
          />
        </div>
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm">Password</label>
        <input
          type="password"
          placeholder="Minimum 6 characters"
          className="w-full bg-[#312B70] px-4 py-4 rounded-xl outline-none"
        />
      </div>

      <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-2xl text-lg font-bold hover:scale-105 transition">
        Login
      </button>
    </div>

    {/* SIGNUP */}
    <div id="signupTab" style={{display:'none'}}>
      <h2 className="text-2xl font-bold mb-5">Create Account</h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm">Mobile Number</label>
        <div className="flex bg-[#312B70] rounded-xl overflow-hidden">
          <select className="bg-transparent px-3 outline-none text-white">
            <option value="+92">🇵🇰 +92</option>
            <option value="+91">🇮🇳 +91</option>
            <option value="+971">🇦🇪 +971</option>
            <option value="+1">🇺🇸 +1</option>
          </select>
          <input
            type="tel"
            placeholder="Enter mobile number"
            className="w-full bg-transparent px-4 py-4 outline-none"
          />
        </div>
        <p className="text-xs text-gray-300 mt-1">
          صرف صحیح موبائل نمبر استعمال کریں
        </p>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm">Password</label>
        <input
          type="password"
          placeholder="Create password"
          className="w-full bg-[#312B70] px-4 py-4 rounded-xl outline-none"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm">Referral Code</label>
        <input
          type="text"
          defaultValue={referral}
          placeholder="Optional referral code"
          className="w-full bg-[#312B70] px-4 py-4 rounded-xl outline-none"
        />
        <p className="text-xs text-gray-300 mt-1">
          اگر لنک سے آئے ہیں تو ریفرل کوڈ خود بخود بھر جائے گا
        </p>
      </div>

      <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-2xl text-lg font-bold hover:scale-105 transition">
        Sign Up
      </button>
    </div>

    <div className="mt-6 text-center text-sm text-gray-300">
      HOGI PAY Secure Authentication System
    </div>
  </div>
</div>

); }
