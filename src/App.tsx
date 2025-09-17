import { useState } from 'react'
import { generateMnemonic,mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Eye, EyeOff, Trash } from "lucide-react";   // icons
// import {ethers} from "ethers";
import { HDNodeWallet } from "ethers";



import bs58 from 'bs58'

function App() {
  const [count, setCount] = useState(0)
  const [theme,setTheme] = useState(true)
  const [mnemonic,setMnemonic] = useState<string[]>([]);
  const [coin,setcoin] = useState("SOL")
  const [showSecret,setShowSecret] = useState(false);
  const [solwallet,setSolWallet] = useState<{publicKey:string,privateKey:string}[]>([])
  const [ethwallet,setEthWallet] = useState<{publicKey:string,privateKey:string}[]>([])

  

  const copyToClipboard = (data:string[] | string)=>{
    if (Array.isArray(data)) {
      navigator.clipboard.writeText(data.join(" "))
    } else {
      navigator.clipboard.writeText(data)
    }
    
    alert("Secret phase copied!")
  }

  const generateWallet = async ()=>{
    const mnemonic = generateMnemonic();
    const arrayMnemo = mnemonic.split(' ')
    setMnemonic(arrayMnemo)
    
    const seed = await mnemonicToSeed(mnemonic);
    if(coin==='SOL'){
      const path = `m/44'/501'/${count}'/0'`
      setCount((c)=>c+1)
      const resultPath = derivePath(path,seed.toString('hex')).key
      const keypair = nacl.sign.keyPair.fromSeed(resultPath)
      const publicKey = bs58.encode(keypair.publicKey)
      const privateKey= bs58.encode(keypair.secretKey)
      setSolWallet(prev => [...prev, { publicKey, privateKey }]);
    } else {
      const path = `m/44'/60'/${count}'/0'`
      setCount((c)=>c+1)
      const root = HDNodeWallet.fromSeed(seed)
      const wallet = root.derivePath(path)

      setEthWallet(prev => [...prev, { publicKey:wallet.address, privateKey:wallet.privateKey }]);
      // setSolWallet(prev => [...prev, { publicKey, privateKey }]);

    }
    

  }

  const addWallet = async()=>{
    if(coin === "SOL"){
      const seed = await mnemonicToSeed(mnemonic.join(' '));
      const path = `m/44'/501'/${count}'/0'`
      setCount((c)=>c+1)
      const resultPath = derivePath(path,seed.toString('hex')).key
      const keypair = nacl.sign.keyPair.fromSeed(resultPath)
      const publicKey = bs58.encode(keypair.publicKey)
      const privateKey= bs58.encode(keypair.secretKey)
      setSolWallet(prev => [...prev, { publicKey, privateKey }]);
    } else{
      const seed = await mnemonicToSeed(mnemonic.join(' '));
      const path = `m/44'/60'/${count}'/0'`
      setCount((c)=>c+1)
      const root = HDNodeWallet.fromSeed(seed)
      const wallet = root.derivePath(path)

      setEthWallet(prev => [...prev, { publicKey:wallet.address, privateKey:wallet.privateKey }]);


    }
    


  }

  const handleClick = ()=>{
    if(mnemonic.length!==0){
      addWallet()
    }else {
      generateWallet()
    }
  }

  
  const stylesP = "p-2 "
  const TrashStyles = "text-red-200 cursor-pointer shadow-md hover:text-red-400"

  return (
    <div className={`${theme ? 'bg-black text-white' : 'bg-white'}  flex flex-col gap-0 justify-between h-screen w-screen overflow-y-scroll m-0`}>
      <div className='relative flex  justify-between mx-28 mt-10'>
        <h1 className='text-2xl font-semibold'>SOET</h1>
        <div className='flex gap-2'>
        <p>Light</p><button className='h-7 w-15 bg-gray-300 rounded-lg' onClick={()=>{setTheme((e)=>!e)}}> 
          <span className={`inline-block h-4 w-4 bg-red-200 rounded-full transition-transform duration-300  ${theme? 'translate-x-4' : '-translate-x-3'}`}/></button>
          <p>Dark</p>
          </div>
      </div>

      <div>
        {/*Wallet Section*/}
        <div className='text-2xl px-14'>
          Secret Recovery Phase
        </div>
        <div className='px-14 mt-4 flex gap-4 items-center justify-center'>
          <input type='text' onChange={(e)=>{setMnemonic([e.target.value])}}
          className='border border-gray-400 rounded px-3 py-2 w-full'/>
          <div className='flex gap-1'>
          <p >SOL</p>
          <button className='h-5 w-10 bg-green-400 rounded-lg flex items-center translate-y-0.5 justify-center' onClick={()=>setcoin(coin === "SOL" ? "ETH":"SOL")}>
            <span className={`inline-block h-3 w-3 rounded-lg bg-red-400 transition-transform duration-300 ${coin === "SOL"?'-translate-x-2':'translate-x-2'}`}></span>
          </button>
          <p>ETH</p>
          </div> 
          <button onClick={handleClick} className='bg-blue-500 hover:bg-blue-600 rounded-x"'>{mnemonic.length !==0 ? 'Add Wallet' : "Generate Wallet" }</button>
         

        </div>
       
      </div>
      <div className='relative mx-14 border-2 border-gray-400  '>
      <div className='flex justify-between text-2xl m-2'>
         
      <h1 className=''>Your Secret Phase</h1> 

      <button onClick={()=>setShowSecret((c)=>!c)}>{showSecret ?<Eye size={24}/>:<EyeOff size={24}/>}</button>
      </div>
      </div> 
      <div className='relative mx-14 shadow-md mt-10'>
       {/*Secret Phase*/ }
       {showSecret && <div onClick={()=>copyToClipboard(mnemonic)} className=' w-full relative mr-42 grid mt-2  gap-2 max-w-full grid-cols-3 p-2'>
        {mnemonic.map((word,i)=>(
          <div key={i} className='flex items-center justify-center  m-2 h-[80%]  max-w-md shadow-md bg-gradient-to-r from-black-500  to-slate-400 text-white'>
            {i+1+". "+word}
          </div>
          ))}
      </div>}

      {/*SOLANA Wallets*/ }
      {solwallet.length!==0 && <div>
        {solwallet.map((ele,i)=>(
          <div key={i} className='flex flex-col p-2'>
            <div className={`flex justify-between rounded-sm ${theme?'bg-[#0A0A0A]': 'bg-white'} p-2`}>
            <h1 className='text-2xl'>Solana Wallet {i+1}</h1>
            <button className={TrashStyles} onClick={()=>{
              if(window.confirm("Are you sure you want to delete the Wallet?")){
                setSolWallet(prev=>prev.filter((_,idx)=>idx!==i))
              }}
            }><Trash size={24}/></button>
          </div>
            <div className={`flex flex-col  ${theme?'bg-[#181818]': 'bg-slate-200'} rounded-md p-2 gap-2`}>
              <h2 className='text-xl font-semibold'>Public Key</h2>
              <h2 className={stylesP} onClick={()=>copyToClipboard(ele.publicKey)}>{ele.publicKey}</h2>
              <h2 className='text-xl font-semibold' >Private Key</h2>
              <h2 className={stylesP} onClick={()=>copyToClipboard(ele.privateKey)}>  {"•".repeat(ele.privateKey.length)}</h2>
            </div>
          </div>

        ))}

        
        </div>}
        {/* ETH Wallets */}
      {ethwallet.length !== 0 && (
        <div>
        {ethwallet.map((ele, i) => (
          <div key={i} className="flex flex-col p-2">
            <div className={`flex justify-between rounded-sm ${theme?'bg-[#0A0A0A]': 'bg-white'} p-2`}>
            <h1 className='text-2xl'>ETH Wallet {i+1}</h1>
            <button className={TrashStyles} onClick={()=>{
              if(window.confirm("Are you sure you want to delete the Wallet?")){
                setEthWallet(prev=>prev.filter((_,idx)=>idx!==i))
              }
            }}><Trash size={24}/></button>
          </div>

            <div className={`flex flex-col ${theme?'bg-[#181818]': 'bg-slate-200'} rounded-md p-2 gap-2`}>
              <h2 className="text-xl font-semibold">Public Key</h2>
              <h2 className={stylesP} onClick={() => copyToClipboard(ele.publicKey)}>
                {ele.publicKey}
              </h2>

              <h2 className="text-xl font-semibold">Private Key</h2>
              <h2
                className={stylesP}
                onClick={() => copyToClipboard(ele.privateKey)}
              >
                {"•".repeat(ele.privateKey.length)}
              </h2>
                </div>
              </div>
          ))}
        </div>
      )}


      </div>
      <footer className="mt-10 py-4 text-center border-t border-gray-600">
      <p className="text-sm text-gray-400">
        Developed by <span className="font-semibold text-gray-200">Sakthivel</span>
      </p>
    </footer>
    </div>
  )
}

export default App
