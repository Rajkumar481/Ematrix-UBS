import React from 'react'

const Salescalculation = () => {
  return (
     <table className="w-full border-collapse mt-6">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">S.No</th>
                        <th className="border p-2">Product Name</th>
                        <th className="border p-2">HSN</th>
                        <th className="border p-2">Quantity</th>
                        <th className="border p-2">Purchase Price</th>
                        <th className="border p-2">Selling Price</th>
                        <th className="border p-2">GST (%)</th>
                        <th className="border p-2">GST Amount</th>
                        <th className="border p-2">Total</th>
                        <th className="border p-2">Total Amount</th>
                        <th className="border p-2">Profit</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border p-2 text-center">1</td>
                        <td className="border p-2"><input type="text" className="w-full p-1 border rounded" /></td>
                        <td className="border p-2"><input type="text" className="w-full p-1 border rounded" /></td>
                        <td className="border p-2"><input type="number" className="w-full p-1 border rounded" /></td>
                        <td className="border p-2"><input type="number" className="w-full p-1 border rounded" /></td>
                        <td className="border p-2"><input type="number" className="w-full p-1 border rounded" /></td>
                        <td className="border p-2"><input type="number" className="w-full p-1 border rounded" /></td>
                        <td className="border p-2 text-center"></td>
                        <td className="border p-2 text-center"></td>
                        <td className="border p-2 text-center"></td>
                        <td className="border p-2 text-center"></td>
                    </tr>
                </tbody>
            </table>
  )
}

export default Salescalculation
