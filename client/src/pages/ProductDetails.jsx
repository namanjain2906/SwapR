import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle.jsx";
import toast from "react-hot-toast";
import Loading from "../components/Loading.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import RentalCalendar from "../components/RentalCalendar.jsx";

const ProductDetails = () => {
	const navigate = useNavigate();
	const { axios } = useAppContext();
	const { getToken, cart, setCart } = useAppContext();
	const { user } = useAppContext();
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [rentalRange, setRentalRange] = useState({ start: null, end: null });
	const [renting, setRenting] = useState(false);
	const [sellerRating, setSellerRating] = useState({ average: 0, count: 0 });
	const [activeRental, setActiveRental] = useState(null);
	const isAvailable = product?.available !== false;
	const today = useMemo(() => {
		const base = new Date();
		base.setHours(0, 0, 0, 0);
		return base;
	}, []);
	const getProductDetails = async () => {
		try {
			const { data } = await axios.get(`/api/products/product-details/${id}`);

			if (data.success) {
				setProduct(data.product);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error(error.message);
		}
	};

	useEffect(() => {
		getProductDetails();
	}, [id]);

	useEffect(() => {
		const sellerId = product?.sellerId?._id ?? product?.sellerId;
		if (!sellerId) return;
		(async () => {
			try {
				const { data } = await axios.get(`/api/reviews/seller/${sellerId}`);
				if (data.success) {
					setSellerRating({ average: data.average ?? 0, count: data.count ?? 0 });
				}
			} catch (err) {
				console.warn("Failed to load seller rating", err?.message || err);
			}
		})();
	}, [axios, product?.sellerId]);

	useEffect(() => {
		const productId = product?._id;
		if (!productId) {
			setActiveRental(null);
			return;
		}
		(async () => {
			try {
				const { data } = await axios.get("/api/orders/rent/active", {
					params: { productId },
				});
				if (data.success) {
					setActiveRental(data.rentals?.[0] ?? null);
				}
			} catch (err) {
				console.warn("Failed to load active rental", err?.message || err);
				setActiveRental(null);
			}
		})();
	}, [axios, product?._id]);

	const handleRent = async () => {
		if (renting) return;
		if (!isAvailable) {
			toast.error("This product is currently rented and unavailable.");
			return;
		}
		const token = await getToken();
		if (!rentalRange.start || !rentalRange.end) {
			toast.error("Please select a valid rental period.");
			return;
		}
		if (!user) {
			toast.error("Login your account first");
			return;
		}
		try {
			setRenting(true);
			const payload = {
				productId: product._id,
				rentalRange: {
					start: rentalRange.start?.toISOString?.() ?? rentalRange.start,
					end: rentalRange.end?.toISOString?.() ?? rentalRange.end,
				},
			};
			const response = await axios.post("/api/orders/rent", payload, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (response.data.success) {
				toast.success(response.data.message);
				setRentalRange({ start: null, end: null });
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.error("Error renting product:", error);
			toast.error("Error renting product.");
		} finally {
			setRenting(false);
		}
	};

	const handleAddToCart = async () => {
		if (!isAvailable) {
			toast.error("This product is currently rented and unavailable.");
			return;
		}
		const token = await getToken();
		if (user) {
			try {
				const response = await axios.post(
					"/api/orders/cart/add",
					{ productId: product._id },
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				if (response.data.success) {
					setCart([...(Array.isArray(cart) ? cart : []), product]);
					toast.success(response.data.message);
				} else {
					toast.error(response.data.message);
				}
			} catch (error) {
				console.error("Error removing product:", error);
				alert("Error removing product.");
			}
		} else {
			toast.error("Login your account first");
		}
	};

	const handleStartDateChange = (selected) => {
		setRentalRange((prev) => {
			const next = { ...prev, start: selected };
			if (prev.end && prev.end < selected) next.end = selected;
			return next;
		});
	};

	const handleEndDateChange = (selected) => {
		setRentalRange((prev) => {
			const next = { ...prev, end: selected };
			if (prev.start && selected < prev.start) next.start = selected;
			return next;
		});
	};

	return product ? (
		<div className=" max-md:m-2 max-md:mt-20 ">
			<div className=" max-md:px-1 max-md:py-3 md:px-20 md:py-5 md:mt-30 flex max-md:flex-col gap-15 max-md:gap-12 items-center">
				<BlurCircle top="50px" right="150px" />
				<img
					className="rounded-2xl max-w-140 object-contain md:h-125 md:w-auto max-md:w-full max-md:h-auto "
					src={product.image_path}
					alt="Product Image"
				/>
				<div className="flex flex-col max-md:justify-center w-100 max-md:items-center">
					<p className="text-[#F84565] text-lg mt-3">
						{product.condition.charAt(0).toUpperCase() +
							product.condition.slice(1)}
					</p>
					<p className=" max-md:text-3xl md:text-4xl mt-2">
						{product.title.charAt(0).toUpperCase() + product.title.slice(1)}
					</p>
					<p className="text-lg mt-2">&#8377;{product.price}</p>
					<p className="text-lg text-gray-300 w-full break-words whitespace-normal h-auto mt-2">
						{product.description}
					</p>
					<button
						onClick={handleAddToCart}
						disabled={
							!isAvailable ||
							(Array.isArray(cart) && cart.some((item) => item._id === product._id))
						}
						className={`bg-[#F84565] py-2 px-6 font-medium rounded-lg mt-5 transition ${
							!isAvailable ? "opacity-60 cursor-not-allowed" : "hover:bg-[#D63854]"
						}`}
					>
						Add To Cart
					</button>
				</div>
				<div className="w-full md:w-auto flex flex-col gap-4">
					<p className="text-sm uppercase tracking-wide text-[#F84565]">
						Rental period
					</p>
					<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<span className="text-sm text-gray-300">Start date</span>
							<RentalCalendar
								value={rentalRange.start}
								onChange={handleStartDateChange}
								minDate={today}
								highlightRange={
									activeRental
										? { start: activeRental.startDate, end: activeRental.endDate }
										: undefined
								}
								emphasis="start"
								disableSelection={Boolean(activeRental)}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<span className="text-sm text-gray-300">End date</span>
							<RentalCalendar
								value={rentalRange.end}
								onChange={handleEndDateChange}
								minDate={rentalRange.start || today}
								highlightRange={
									activeRental
										? { start: activeRental.startDate, end: activeRental.endDate }
										: undefined
								}
								emphasis="end"
								disableSelection={Boolean(activeRental)}
							/>
						</div>
					</div>
					{!isAvailable && activeRental && (
						<p className="text-xs text-amber-400">
							This product is currently being rented from{" "}
							{new Date(activeRental.startDate).toLocaleDateString()} to{" "}
							{new Date(activeRental.endDate).toLocaleDateString()}. It will become available once the rental period ends.
						</p>
					)}
					<button
						onClick={handleRent}
						disabled={renting || !isAvailable}
						className={`bg-[#F84565] py-2 px-6 font-medium rounded-lg mt-5 transition ${
							renting || !isAvailable ? "opacity-70 cursor-not-allowed" : "hover:bg-[#D63854]"
						}`}
					>
						{renting ? "Sending…" : "Rent"}
					</button>
				</div>
			</div>
			<div className="flex flex-col justify-center my-10  items-center">
				<BlurCircle top="650px" left="200px" />
				<p className="text-center text-4xl m-10 font-medium">Seller Details</p>
				<div className="text-center h-screen p-5 text-lg backdrop-blur border border-[#D63854]/20 bg-[#D63854]/10  rounded-lg mt-5 max-md:w-[80%] md:w-[50%]">
					<p>
						<span className="text-[#F84565]">Seller:</span> &nbsp;{" "}
						{product.sellerId.name}
					</p>
					<p>
						<span className="text-[#F84565]">Address:</span> &nbsp;{" "}
						{product.sellerId.area}, {product.sellerId.city},{" "}
						{product.sellerId.city_code}, {product.sellerId.state}
					</p>
					<p>
						<span className="text-[#F84565]">Rating:</span>&nbsp;
						{sellerRating.count
							? `${sellerRating.average.toFixed(1)}/5 (${sellerRating.count} review${sellerRating.count > 1 ? "s" : ""})`
							: "No reviews yet"}
					</p>
					{user?.id && product?.sellerId?._id && String(user.id) !== String(product.sellerId._id) ? (
						<button
							onClick={() => navigate(`/chat/${product.sellerId._id}`)}
							className="bg-[#F84565] py-2 px-4 font-medium rounded-lg mt-5 cursor-pointer hover:bg-[#D63854]"
						>
							Contact
						</button>
					) : null}
					
				</div>
			</div>
		</div>
	) : (
		<Loading />
	);
};

export default ProductDetails;
