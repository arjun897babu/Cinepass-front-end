import React from "react"
import { Carousel } from "../../component/user/carousel"

const slides = [
  'https://assetscdn1.paytm.com/images/catalog/view_item/2699999/1719408000464.jpg?format=webp&imwidth=1750',
  'https://assetscdn1.paytm.com/images/catalog/view_item/2699999/1719408000464.jpg?format=webp&imwidth=1750'
]
const UserHome: React.FC = (): JSX.Element => {
  return (
    <div className="h-screen">
      <h1>home</h1>
      <div className="pt-2">
        <Carousel slides={slides} />
      </div>
    </div>
  )
}


export default UserHome