// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Pencil, Star, Trash } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// interface Review {
//   _id: string;
//   user: string;
//   rating: number;
//   comment: string;
//   date: string;
//   productId: number;
// }

// export default function ReviewsPage() {
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [editingReview, setEditingReview] = useState<Review | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   useEffect(() => {
//     fetchReviews();
//   }, []);

//   async function fetchReviews() {
//     const res = await fetch("/api/reviews");
//     const data = await res.json();
//     setReviews(data);
//   }

//   async function handleDelete(id: string) {
//     setReviews((prev) => prev.filter((review) => review._id !== id));
//     await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
//     toast.success("Review deleted successfully!");
//   }

//   async function handleEdit() {
//     if (!editingReview) return;
//     await fetch(`/api/reviews?id=${editingReview._id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(editingReview),
//     });
//     setIsDialogOpen(false);
//     fetchReviews();
//     toast.success("Review updated successfully!");
//   }

//   return (
//     <Card className="p-4">
//       <CardContent>
//         <ToastContainer />
//         <motion.h1
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="text-3xl font-bold mb-6 text-[#F5813F] text-center"
//         >
//           Customer Reviews
//         </motion.h1>

//         {/* Desktop Table View */}
//         <div className="hidden md:block overflow-x-auto">
//           <Table className="w-full border-collapse">
//             <TableHeader>
//               <TableRow className="bg-[#2b8f98] text-white text-lg hover:bg-[#007580]">
//                 <TableHead className="px-4 py-2">User</TableHead>
//                 <TableHead className="px-4 py-2">Rating</TableHead>
//                 <TableHead className="px-4 py-2">Comment</TableHead>
//                 <TableHead className="px-4 py-2">Date</TableHead>
//                 <TableHead className="px-4 py-2">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               <AnimatePresence>
//                 {reviews.map((review) => (
//                   <motion.tr
//                     key={review._id}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.9 }}
//                     transition={{ duration: 0.3 }}
//                     className="text-base border-b"
//                   >
//                     <TableCell className="px-4 py-2">{review.user}</TableCell>
//                     <TableCell className="px-6 py-4 flex items-center space-x-1">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`w-5 h-5 ${
//                             i < review.rating
//                               ? "fill-[#F5813F] text-[#F5813F]"
//                               : "text-gray-300"
//                           }`}
//                         />
//                       ))}
//                     </TableCell>
//                     <TableCell className="px-4 py-2">
//                       {review.comment}
//                     </TableCell>
//                     <TableCell className="px-4 py-2">
//                       {new Date(review.date).toLocaleDateString()}
//                     </TableCell>
//                     <TableCell className="px-4 py-2">
//                       <div className="flex gap-4">
//                         <Button
//                           onClick={() => {
//                             setEditingReview(review);
//                             setIsDialogOpen(true);
//                           }}
//                           className="bg-[#007580] text-white hover:bg-[#2b8f98ea] px-3 py-1 rounded-md flex items-center gap-2"
//                         >
//                           <Pencil className="w-4 h-4" /> Edit
//                         </Button>
//                         <Button
//                           onClick={() => handleDelete(review._id)}
//                           className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded-md flex items-center gap-2"
//                         >
//                           <Trash className="w-4 h-4" /> Delete
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </motion.tr>
//                 ))}
//               </AnimatePresence>
//             </TableBody>
//           </Table>
//         </div>

//         {/* Mobile View - Cards */}
//         <div className="md:hidden flex flex-col gap-4 items-center w-full bg-white  rounded-lg  p-4">
//           {reviews.map((review) => (
//             <Card
//               key={review._id}
//               className="p-5 sm:p-6 shadow-md rounded-lg w-full max-w-[95%] sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] min-w-[320px]"
//             >
//               <CardContent className="flex flex-col gap-4">
//                 <h2 className="text-base sm:text-lg font-semibold">
//                   {review.user}
//                 </h2>
//                 <div className="flex items-center">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`w-5 h-5 ${
//                         i < review.rating
//                           ? "fill-[#F5813F] text-[#F5813F]"
//                           : "text-gray-300"
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <p className="text-sm sm:text-base text-gray-700">
//                   {review.comment}
//                 </p>
//                 <p className="text-xs sm:text-sm text-gray-500">
//                   {new Date(review.date).toLocaleDateString()}
//                 </p>
//                 <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full">
//                   <Button
//                     onClick={() => {
//                       setEditingReview(review);
//                       setIsDialogOpen(true);
//                     }}
//                     className="bg-[#2b8f98] text-white flex items-center gap-2 px-4 py-2 rounded-md w-full sm:w-auto"
//                   >
//                     <Pencil className="w-4 h-4" /> Edit
//                   </Button>
//                   <Button
//                     onClick={() => handleDelete(review._id)}
//                     className="bg-red-600 text-white flex items-center gap-2 px-4 py-2 rounded-md w-full sm:w-auto"
//                   >
//                     <Trash className="w-4 h-4" /> Delete
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </CardContent>

//       {editingReview && (
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
//             <DialogHeader>
//               <DialogTitle className="text-xl font-semibold text-[#2b8f98]">
//                 Edit Review
//               </DialogTitle>
//             </DialogHeader>
//             <Input
//               value={editingReview.user}
//               onChange={(e) =>
//                 setEditingReview({ ...editingReview, user: e.target.value })
//               }
//               placeholder="User name"
//               className="mb-2 border-gray-300"
//             />
//             <div className="flex space-x-2 my-2">
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                   key={i}
//                   className={`cursor-pointer w-6 h-6 ${
//                     i < editingReview.rating
//                       ? "fill-[#F5813F] text-[#F5813F]"
//                       : "text-gray-300"
//                   }`}
//                   onClick={() =>
//                     setEditingReview({ ...editingReview, rating: i + 1 })
//                   }
//                 />
//               ))}
//             </div>
//             <Textarea
//               value={editingReview.comment}
//               onChange={(e) =>
//                 setEditingReview({ ...editingReview, comment: e.target.value })
//               }
//               placeholder="Comment"
//               className="border-gray-300"
//             />
//             <div className="flex justify-end mt-4">
//               <Button
//                 onClick={handleEdit}
//                 className="bg-[#2b8f98] text-white hover:bg-[#007580]"
//               >
//                 Save Changes
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}
//     </Card>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Star, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Review {
  _id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  productId: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    const res = await fetch("/api/reviews");
    const data = await res.json();
    setReviews(data);
  }

  async function handleDelete(id: string) {
    setReviews((prev) => prev.filter((review) => review._id !== id));
    await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
    toast.success("Review deleted successfully!");
  }

  async function handleEdit() {
    if (!editingReview) return;
    await fetch(`/api/reviews?id=${editingReview._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingReview),
    });
    setIsDialogOpen(false);
    fetchReviews();
    toast.success("Review updated successfully!");
  }

  return (
    <Card className="p-4">
      <CardContent>
        <ToastContainer />
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-6 text-[#F5813F] text-center"
        >
          Customer Reviews
        </motion.h1>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table className="w-full border-collapse">
            <TableHeader>
              <TableRow className="bg-[#2b8f98] text-white text-lg hover:bg-[#007580]">
                <TableHead className="px-4 py-2">User</TableHead>
                <TableHead className="px-4 py-2">Rating</TableHead>
                <TableHead className="px-4 py-2">Comment</TableHead>
                <TableHead className="px-4 py-2">Date</TableHead>
                <TableHead className="px-4 py-2">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {reviews.map((review) => (
                  <motion.tr
                    key={review._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="text-base border-b"
                  >
                    <TableCell className="px-4 py-2">{review.user}</TableCell>
                    <TableCell className="px-6 py-4 flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating
                              ? "fill-[#F5813F] text-[#F5813F]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {review.comment}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {new Date(review.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <div className="flex gap-4">
                        <Button
                          onClick={() => {
                            setEditingReview(review);
                            setIsDialogOpen(true);
                          }}
                          className="bg-[#007580] text-white hover:bg-[#2b8f98ea] px-3 py-1 rounded-md flex items-center gap-2"
                        >
                          <Pencil className="w-4 h-4" /> Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(review._id)}
                          className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded-md flex items-center gap-2"
                        >
                          <Trash className="w-4 h-4" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {/* Mobile View - Cards */}
        <div className="md:hidden flex flex-col gap-4 items-center w-full">
  {reviews.map((review) => (
    <Card
      key={review._id}
      className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] min-w-[320px] shadow-md rounded-lg border p-3 sm:p-5"
    >
      <CardContent className="flex flex-col gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          {review.user}
        </h2>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < review.rating ? "fill-[#F5813F] text-[#F5813F]" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-sm sm:text-base text-gray-700 break-words">
          {review.comment}
        </p>
        <p className="text-xs sm:text-sm text-gray-500">
          {new Date(review.date).toLocaleDateString()}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full">
          <Button
            onClick={() => {
              setEditingReview(review);
              setIsDialogOpen(true);
            }}
            className="bg-[#007580] text-white hover:bg-[#2b8f98ea] flex items-center gap-2 px-4 py-2 rounded-md w-full sm:w-auto"
          >
            <Pencil className="w-4 h-4" /> Edit
          </Button>
          <Button
            onClick={() => handleDelete(review._id)}
            className="bg-red-500 text-white hover:bg-red-600 flex items-center gap-2 px-4 py-2 rounded-md w-full sm:w-auto"
          >
            <Trash className="w-4 h-4" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

      </CardContent>

      {editingReview && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-[#2b8f98]">
                Edit Review
              </DialogTitle>
            </DialogHeader>
            <Input
              value={editingReview.user}
              onChange={(e) =>
                setEditingReview({ ...editingReview, user: e.target.value })
              }
              placeholder="User name"
              className="mb-2 border-gray-300"
            />
            <div className="flex space-x-2 my-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`cursor-pointer w-6 h-6 ${
                    i < editingReview.rating
                      ? "fill-[#F5813F] text-[#F5813F]"
                      : "text-gray-300"
                  }`}
                  onClick={() =>
                    setEditingReview({ ...editingReview, rating: i + 1 })
                  }
                />
              ))}
            </div>
            <Textarea
              value={editingReview.comment}
              onChange={(e) =>
                setEditingReview({ ...editingReview, comment: e.target.value })
              }
              placeholder="Comment"
              className="border-gray-300"
            />
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleEdit}
                className="bg-[#2b8f98] text-white hover:bg-[#007580]"
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}