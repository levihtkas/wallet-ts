import { useState } from 'react'


function App() {
  const [count, setCount] = useState(0)
  const [theme,setTheme] = useState(true)
  const [mnemonic,setMnemonic] = useState('');
  const [coin,setcoin] = useState("SOL")

  const generateWallet = ()=>{

  }

  const addWallet = ()=>{

  }

  const handleClick = ()=>{
    if(mnemonic.trim()){
      addWallet()
    }else {
      generateWallet()
    }
  }
  return (
    <div className={`${theme ? 'bg-black text-white' : 'bg-white'}  h-screen w-screen overflow-hidden`}>
      <div className='relative flex  justify-between mx-28 mt-4'>
        <h1 className='text-2xl font-semibold'>SOET</h1>
        <div className='flex gap-2'>
        <p>Light</p><button className='h-7 w-15 bg-gray-300 rounded-lg' onClick={()=>{setTheme((e)=>!e)}}> 
          <span className={`inline-block h-4 w-4 bg-red-200 rounded-full transition-transform duration-300  ${theme? 'translate-x-4' : '-translate-x-3'}`}/></button>
          <p>Dark</p>
          </div>
      </div>

      <div>
        {/*Wallet Section*/}
        <div className='text-2xl pt-10 px-14'>
          Secret Recovery Phase
        </div>
        <div className='px-14 mt-4 flex gap-4 items-center justify-center'>
          <input type='text' onChange={(e)=>{setMnemonic(e.target.value)}}
          className='border border-gray-400 rounded px-3 py-2 w-full'/>
          <div className='flex gap-1'>
          <p >SOL</p>
          <button className='h-5 w-10 bg-green-400 rounded-lg flex items-center translate-y-0.5 justify-center' onClick={()=>setcoin(coin === "SOL" ? "ETH":"SOL")}>
            <span className={`inline-block h-3 w-3 rounded-lg bg-red-400 transition-transform duration-300 ${coin === "SOL"?'-translate-x-2':'translate-x-2'}`}></span>
          </button>
          <p>ETH</p>
          </div> 
          <button onClick={handleClick} className='bg-blue-500 hover:bg-blue-600 rounded-x"'>{mnemonic.trim() ? 'Add Wallet' : "Generate Wallet" }</button>
         

        </div>
      </div>

    </div>
  )
}

export default App
