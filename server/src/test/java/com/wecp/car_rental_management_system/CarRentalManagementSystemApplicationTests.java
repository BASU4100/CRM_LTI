package com.wecp.car_rental_management_system;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wecp.car_rental_management_system.dto.BookingDto;
import com.wecp.car_rental_management_system.dto.LoginRequest;
import com.wecp.car_rental_management_system.entity.*;
import com.wecp.car_rental_management_system.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import javax.transaction.Transactional;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Transactional
class CarRentalManagementSystemApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private CarRepository carRepository;

	@Autowired
	private BookingRepository bookingRepository;

	@Autowired
	private PaymentRepository paymentRepository;

	@Autowired
	private CarCategoryRepository carCategoryRepository;

	@BeforeEach
	public void setUp() {
		// Clear the database before each test
		userRepository.deleteAll();
		carCategoryRepository.deleteAll();
		bookingRepository.deleteAll();
		paymentRepository.deleteAll();
		carRepository.deleteAll();
	}

	@Test
	public void testRegisterUser() throws Exception {
		User user = new User();
		user.setUsername("testUser");
		user.setPassword("testPassword");
		user.setEmail("test@example.com");
		user.setRole("AGENT");

		// Perform a POST request to the /register endpoint using MockMvc
		mockMvc.perform(post("/api/user/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(user)))
				.andExpect(jsonPath("$.username").value("testUser"))
				.andExpect(jsonPath("$.email").value("test@example.com"))
				.andExpect(jsonPath("$.role").value("AGENT"));

		// Assert business is created in the database
		User savedUser = userRepository.findAll().get(0);
		assertEquals("testUser", savedUser.getUsername());
		assertEquals("test@example.com", savedUser.getEmail());
		assertEquals("AGENT", savedUser.getRole());
	}

	@Test
	public void testLoginUser() throws Exception {
		User user = new User();
		user.setUsername("testUser");
		user.setPassword("testPassword");
		user.setEmail("test@example.com");
		user.setRole("AGENT");


		// Perform a POST request to the /register endpoint using MockMvc
		mockMvc.perform(post("/api/user/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(user)));
		// Login with the registered user
		LoginRequest loginRequest = new LoginRequest("testUser", "testPassword");

		mockMvc.perform(post("/api/user/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest)))
				.andExpect(jsonPath("$.token").exists());
	}

	@Test
	public void testLoginWithWrongUsernameOrPassword() throws Exception {
		// Create a login request with a wrong username
		LoginRequest loginRequest = new LoginRequest("wronguser", "password");

		mockMvc.perform(post("/api/user/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest)))
				.andExpect(status().isUnauthorized()); // Expect a 401 Unauthorized response
	}

	// admin controller
	@Test
	@WithMockUser(authorities = {"ADMINISTRATOR"})
	public void testCreateCarCategory() throws Exception {
		CarCategory carCategory = new CarCategory();
		carCategory.setName("SUV");
		carCategory.setDescription("Sport Utility Vehicle");
		carCategory.setBaseRate(100.0);

		// Perform a POST request to the /api/administrator/car-categories endpoint
		mockMvc.perform(post("/api/administrator/car-categories")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(carCategory)))
				.andExpect(jsonPath("$.name").value("SUV"))
				.andExpect(jsonPath("$.description").value("Sport Utility Vehicle"));

		// Assert the car category is created in the database
		CarCategory savedCategory = carCategoryRepository.findAll().get(0);
		assertEquals("SUV", savedCategory.getName());
		assertEquals("Sport Utility Vehicle", savedCategory.getDescription());
		assertEquals(100.0, savedCategory.getBaseRate());
	}

	@Test
	@WithMockUser(authorities = {"ADMINISTRATOR"})
	public void testGetAllCarCategories() throws Exception {
		// Create and save car categories to the database
		CarCategory category1 = new CarCategory();
		category1.setName("SUV");
		category1.setDescription("Sport Utility Vehicle");
		category1.setBaseRate(100.0);

		CarCategory category2 = new CarCategory();
		category2.setName("Sedan");
		category2.setDescription("Standard Passenger Car");
		category2.setBaseRate(80.0);

		carCategoryRepository.save(category1);
		carCategoryRepository.save(category2);

		// Perform a GET request to the /api/administrator/car-categories endpoint
		mockMvc.perform(get("/api/administrator/car-categories")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$[0].name").value("SUV"))
				.andExpect(jsonPath("$[0].description").value("Sport Utility Vehicle"))
				.andExpect(jsonPath("$[0].baseRate").value(100.0))
				.andExpect(jsonPath("$[1].name").value("Sedan"))
				.andExpect(jsonPath("$[1].description").value("Standard Passenger Car"))
				.andExpect(jsonPath("$[1].baseRate").value(80.0));
	}

	@Test
	@WithMockUser(authorities = {"ADMINISTRATOR"})
	public void testUpdateCarCategory() throws Exception {
		// Create and save a car category to the database
		CarCategory category = new CarCategory();
		category.setName("SUV");
		category.setDescription("Sport Utility Vehicle");
		category.setBaseRate(100.0);
		carCategoryRepository.save(category);

		// Prepare updated data
		CarCategory updatedCategory = new CarCategory();
		updatedCategory.setName("Updated SUV");
		updatedCategory.setDescription("Updated Sport Utility Vehicle");
		updatedCategory.setBaseRate(100.0);

		// Perform a PUT request to the /api/administrator/car-categories/{categoryId} endpoint
		mockMvc.perform(put("/api/administrator/car-categories/" + category.getId())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updatedCategory)))
				.andExpect(jsonPath("$.name").value("Updated SUV"))
				.andExpect(jsonPath("$.description").value("Updated Sport Utility Vehicle"));

		// Assert the car category is updated in the database
		CarCategory savedCategory = carCategoryRepository.findById(category.getId()).orElse(null);
		assertNotNull(savedCategory);
		assertEquals("Updated SUV", savedCategory.getName());
		assertEquals("Updated Sport Utility Vehicle", savedCategory.getDescription());
		assertEquals(100.0, savedCategory.getBaseRate(), 0.01);
	}

	@Test
	@WithMockUser(authorities = {"ADMINISTRATOR"})
	public void testGetAllBookings() throws Exception {
		// Create and save users and car categories for creating bookings
		User user = new User();
		user.setUsername("testCustomer");
		user.setPassword("testPassword");
		user.setEmail("testcustomer@example.com");
		user.setRole("CUSTOMER");
		userRepository.save(user);

		CarCategory carCategory = new CarCategory();
		carCategory.setName("SUV");
		carCategory.setDescription("Sport Utility Vehicle");
		carCategory.setBaseRate(100.0);
		carCategoryRepository.save(carCategory);

		Car car = new Car();
		car.setMake("Toyota");
		car.setModel("RAV4");
		car.setManufactureYear("2021");
		car.setRegistrationNumber("ABC123");
		car.setStatus("available");
		car.setRentalRatePerDay(100.0);
		car.setCategory(carCategory);
		carRepository.save(car);

		Booking booking1 = new Booking();
		booking1.setUser(user);
		booking1.setCar(car);
		booking1.setRentalStartDate(new Date());
		booking1.setRentalEndDate(new Date());
		booking1.setStatus("confirmed");
		booking1.setTotalAmount(500.0);
		bookingRepository.save(booking1);

		Booking booking2 = new Booking();
		booking2.setUser(user);
		booking2.setCar(car);
		booking2.setRentalStartDate(new Date());
		booking2.setRentalEndDate(new Date());
		booking2.setStatus("pending");
		booking2.setTotalAmount(1500.0);
		bookingRepository.save(booking2);

		// Perform a GET request to the /api/administrator/reports/bookings endpoint
		mockMvc.perform(get("/api/administrator/reports/bookings")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$[0].status").value("confirmed"))
				.andExpect(jsonPath("$[0].car.make").value("Toyota"))
				.andExpect(jsonPath("$[1].status").value("pending"))
				.andExpect(jsonPath("$[1].car.make").value("Toyota"));
	}

	@Test
	@WithMockUser(authorities = {"ADMINISTRATOR"})
	public void testGetAllPayments() throws Exception {
		// Create and save users and car categories for creating bookings and payments
		User user = new User();
		user.setUsername("testCustomer");
		user.setPassword("testPassword");
		user.setEmail("testcustomer@example.com");
		user.setRole("CUSTOMER");
		userRepository.save(user);

		CarCategory carCategory = new CarCategory();
		carCategory.setName("SUV");
		carCategory.setDescription("Sport Utility Vehicle");
		carCategory.setBaseRate(100.0);
		carCategoryRepository.save(carCategory);

		Car car = new Car();
		car.setMake("Toyota");
		car.setModel("RAV4");
		car.setManufactureYear("2021");
		car.setRegistrationNumber("ABC123");
		car.setStatus("available");
		car.setRentalRatePerDay(100.0);
		car.setCategory(carCategory);
		carRepository.save(car);

		Booking booking = new Booking();
		booking.setUser(user);
		booking.setCar(car);
		booking.setRentalStartDate(new Date());
		booking.setRentalEndDate(new Date());
		booking.setStatus("confirmed");
		booking.setTotalAmount(500.0);
		bookingRepository.save(booking);

		Payment payment1 = new Payment();
		payment1.setBooking(booking);
		payment1.setAmount(500.0);
		payment1.setPaymentDate(new Date());
		payment1.setPaymentMethod("Credit Card");
		payment1.setPaymentStatus("paid");
		paymentRepository.save(payment1);

		Payment payment2 = new Payment();
		payment2.setBooking(booking);
		payment2.setAmount(100.0);
		payment2.setPaymentDate(new Date());
		payment2.setPaymentMethod("Credit Card");
		payment2.setPaymentStatus("paid");
		paymentRepository.save(payment2);

		// Perform a GET request to the /api/administrator/reports/payments endpoint
		mockMvc.perform(get("/api/administrator/reports/payments")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$[0].amount").value(500.0))
				.andExpect(jsonPath("$[0].paymentMethod").value("Credit Card"))
				.andExpect(jsonPath("$[0].booking.status").value("confirmed"))
				.andExpect(jsonPath("$[1].amount").value(100.0))
				.andExpect(jsonPath("$[1].paymentMethod").value("Credit Card"))
				.andExpect(jsonPath("$[1].booking.status").value("confirmed"));
	}

	// agent controller
	@Test
	@WithMockUser(authorities = {"AGENT"})
	public void testAddCar() throws Exception {
		// Create and save a car category
		CarCategory carCategory = new CarCategory();
		carCategory.setName("Sedan");
		carCategory.setDescription("A small to medium-sized car with a separate trunk.");
		carCategory.setBaseRate(75.0);
		carCategoryRepository.save(carCategory);

		// Create a car object to be added
		Car car = new Car();
		car.setMake("Honda");
		car.setModel("Civic");
		car.setManufactureYear("2022");
		car.setRegistrationNumber("XYZ789");
		car.setStatus("available");
		car.setRentalRatePerDay(75.0);
		car.setCategory(carCategory);

		// Perform a POST request to the /api/agent/car endpoint
		mockMvc.perform(post("/api/agent/car")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(car)))
				.andExpect(jsonPath("$.make").value("Honda"))
				.andExpect(jsonPath("$.model").value("Civic"))
				.andExpect(jsonPath("$.manufactureYear").value("2022"))
				.andExpect(jsonPath("$.registrationNumber").value("XYZ789"))
				.andExpect(jsonPath("$.status").value("available"))
				.andExpect(jsonPath("$.rentalRatePerDay").value(75.0))
				.andExpect(jsonPath("$.category.name").value("Sedan"));
	}

	@Test
	@WithMockUser(authorities = {"AGENT"})
	public void testUpdateCar() throws Exception {
		// Create and save a car category
		CarCategory carCategory = new CarCategory();
		carCategory.setName("SUV");
		carCategory.setDescription("Sport Utility Vehicle");
		carCategoryRepository.save(carCategory);

		// Create and save an initial car object
		Car car = new Car();
		car.setMake("Ford");
		car.setModel("Escape");
		car.setManufactureYear("2021");
		car.setRegistrationNumber("LMN456");
		car.setStatus("available");
		car.setRentalRatePerDay(85.0);
		car.setCategory(carCategory);
		carRepository.save(car);

		// Create an updated car object
		Car updatedCar = new Car();
		updatedCar.setMake("Ford");
		updatedCar.setModel("Escape");
		updatedCar.setManufactureYear("2021");
		updatedCar.setRegistrationNumber("LMN456");
		updatedCar.setStatus("in_maintenance");
		updatedCar.setRentalRatePerDay(90.0);
		updatedCar.setCategory(carCategory);

		// Perform a PUT request to the /api/agent/car/{carId} endpoint
		mockMvc.perform(put("/api/agent/car/" + car.getId())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updatedCar)))
				.andExpect(jsonPath("$.status").value("in_maintenance"))
				.andExpect(jsonPath("$.rentalRatePerDay").value(90.0));

		Car car1 = carRepository.findAll().get(0);
		assertEquals(car1.getStatus(), "in_maintenance");
		assertEquals(car1.getRentalRatePerDay(), 90.0, 0.01);
	}

	@Test
	@WithMockUser(authorities = {"AGENT"})
	public void testUpdateBookingStatus() throws Exception {
		// Arrange: Create and save a user, car, and booking
		User agent = new User();
		agent.setUsername("agentUser");
		agent.setPassword("agentPassword");
		agent.setEmail("agent@example.com");
		agent.setRole("AGENT");
		userRepository.save(agent);

		CarCategory category = new CarCategory();
		category.setName("SUV");
		category.setDescription("Sports Utility Vehicle");
		category.setBaseRate(80.0);
		carCategoryRepository.save(category);

		Car car = new Car();
		car.setMake("Toyota");
		car.setModel("RAV4");
		car.setManufactureYear("2021");
		car.setRegistrationNumber("ABC123");
		car.setStatus("available");
		car.setRentalRatePerDay(100.0);
		car.setCategory(category);
		carRepository.save(car);

		Booking booking = new Booking();
		booking.setUser(agent);
		booking.setCar(car);
		booking.setRentalStartDate(new Date());
		booking.setRentalEndDate(new Date());
		booking.setStatus("pending");
		booking.setTotalAmount(500.0);
		bookingRepository.save(booking);

		// Act: Perform the PUT request to update the booking status
		mockMvc.perform(put("/api/agent/bookings/" + booking.getId() + "/status")
						.param("status", "confirmed"))
				.andExpect(jsonPath("$.status").value("confirmed"));

		Booking booking1 = bookingRepository.findById(booking.getId()).orElse(null);
		assertEquals("confirmed", booking1.getStatus());
	}

	@Test
	@WithMockUser(authorities = {"AGENT"})
	public void testCreatePayment() throws Exception {
		// Arrange: Create and save a user, car, and booking
		User customer = new User();
		customer.setUsername("customerUser");
		customer.setPassword("customerPassword");
		customer.setEmail("customer@example.com");
		customer.setRole("CUSTOMER");
		userRepository.save(customer);

		CarCategory category = new CarCategory();
		category.setName("Sedan");
		category.setDescription("A small car with a separate trunk.");
		category.setBaseRate(90.0);
		carCategoryRepository.save(category);

		Car car = new Car();
		car.setMake("Honda");
		car.setModel("Civic");
		car.setManufactureYear("2020");
		car.setRegistrationNumber("XYZ789");
		car.setStatus("available");
		car.setRentalRatePerDay(80.0);
		car.setCategory(category);
		carRepository.save(car);

		Booking booking = new Booking();
		booking.setUser(customer);
		booking.setCar(car);
		booking.setRentalStartDate(new Date());
		booking.setRentalEndDate(new Date());
		booking.setStatus("confirmed");
		booking.setTotalAmount(240.0);
		bookingRepository.save(booking);

		Payment paymentRequest = new Payment();
		paymentRequest.setAmount(240.0);
		paymentRequest.setPaymentDate(new Date());
		paymentRequest.setPaymentMethod("Credit Card");
		paymentRequest.setPaymentStatus("paid");

		// Act: Perform the POST request to create the payment
		mockMvc.perform(post("/api/agent/payment/" + booking.getId())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(paymentRequest)))
				.andExpect(jsonPath("$.amount").value(240.0))
				.andExpect(jsonPath("$.paymentMethod").value("Credit Card"))
				.andExpect(jsonPath("$.paymentStatus").value("paid"));

		Payment payment = paymentRepository.findAll().get(0);
		assertEquals(payment.getPaymentMethod(), "Credit Card");
		assertEquals(payment.getPaymentStatus(), "paid");
		assertEquals(payment.getAmount(), 240.0, 0.01);
	}

	// customer controller
	@Test
	@WithMockUser(authorities = {"CUSTOMER"})
	public void testGetAvailableCars() throws Exception {
		// Arrange: Create and save cars, some available and some not available
		CarCategory category = new CarCategory();
		category.setName("Hatchback");
		category.setDescription("A compact car with a hatch-type rear door.");
		carCategoryRepository.save(category);

		Car availableCar1 = new Car();
		availableCar1.setMake("Ford");
		availableCar1.setModel("Focus");
		availableCar1.setManufactureYear("2022");
		availableCar1.setRegistrationNumber("FORD123");
		availableCar1.setStatus("available");
		availableCar1.setRentalRatePerDay(70.0);
		availableCar1.setCategory(category);
		carRepository.save(availableCar1);

		Car availableCar2 = new Car();
		availableCar2.setMake("Chevrolet");
		availableCar2.setModel("Spark");
		availableCar2.setManufactureYear("2021");
		availableCar2.setRegistrationNumber("CHEV123");
		availableCar2.setStatus("available");
		availableCar2.setRentalRatePerDay(60.0);
		availableCar2.setCategory(category);
		carRepository.save(availableCar2);

		Car bookedCar = new Car();
		bookedCar.setMake("Toyota");
		bookedCar.setModel("Corolla");
		bookedCar.setManufactureYear("2020");
		bookedCar.setRegistrationNumber("TOYO123");
		bookedCar.setStatus("booked");
		bookedCar.setRentalRatePerDay(50.0);
		bookedCar.setCategory(category);
		carRepository.save(bookedCar);

		// Act: Perform the GET request to retrieve available cars
		mockMvc.perform(get("/api/customers/cars/available"))
				.andExpect(jsonPath("$.length()").value(2))
				.andExpect(jsonPath("$[0].status").value("available"))
				.andExpect(jsonPath("$[0].make").value("Ford"))
				.andExpect(jsonPath("$[1].status").value("available"))
				.andExpect(jsonPath("$[1].make").value("Chevrolet"));
	}

	@Test
	@WithMockUser(authorities = {"CUSTOMER"})
	public void testBookCar() throws Exception {
		// Arrange: Create and save a user and an available car
		User customer = new User();
		customer.setUsername("customerUser");
		customer.setPassword("customerPassword");
		customer.setEmail("customer@example.com");
		customer.setRole("CUSTOMER");
		customer = userRepository.save(customer);

		CarCategory category = new CarCategory();
		category.setName("SUV");
		category.setDescription("Sports Utility Vehicle");
		category.setBaseRate(20.0);
		carCategoryRepository.save(category);

		Car car = new Car();
		car.setMake("Hyundai");
		car.setModel("Tucson");
		car.setManufactureYear("2021");
		car.setRegistrationNumber("HYUN123");
		car.setStatus("available");
		car.setRentalRatePerDay(90.0);
		car.setCategory(category);
		car = carRepository.save(car);

		BookingDto bookingDto = new BookingDto();
		bookingDto.setRentalStartDate(new Date());
		bookingDto.setRentalEndDate(new Date());

		// Act: Perform the POST request to book the car
		mockMvc.perform(post("/api/customers/booking")
						.param("userId", customer.getId().toString())
						.param("carId", car.getId().toString())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(bookingDto)))
				.andExpect(jsonPath("$.user.id").value(customer.getId()))
				.andExpect(jsonPath("$.car.id").value(car.getId()));

		List<Booking> bookingList = bookingRepository.findAll();
		assertEquals(1, bookingList.size());
	}

	// permission tests
	@Test
	@WithMockUser(authorities = {"AGENT", "CUSTOMER"})
	public void testAdministratorApiShouldBeForbiddenForOtherUser() throws Exception {
		mockMvc.perform(post("/api/administrator/car-categories")
						.content(""))
				.andExpect(status().isForbidden());

		mockMvc.perform(get("/api/administrator/car-categories")
						.content(""))
				.andExpect(status().isForbidden());

		mockMvc.perform(put("/api/administrator/car-categories/1")
						.content(""))
				.andExpect(status().isForbidden());

		mockMvc.perform(get("/api/administrator/reports/bookings"))
				.andExpect(status().isForbidden());

		mockMvc.perform(get("/api/administrator/reports/payments"))
				.andExpect(status().isForbidden());
	}

	@Test
	@WithMockUser(authorities = {"ADMINISTRATOR", "CUSTOMER"})
	public void testAgentApiShouldBeForbiddenForOtherUser() throws Exception {
		mockMvc.perform(post("/api/agent/car")
						.content(""))
				.andExpect(status().isForbidden());

		mockMvc.perform(put("/api/agent/car/1")
						.content(""))
				.andExpect(status().isForbidden());

		mockMvc.perform(get("/api/agent/bookings"))
				.andExpect(status().isForbidden());

		mockMvc.perform(put("/api/agent/bookings/1/status"))
				.andExpect(status().isForbidden());

		mockMvc.perform(post("/api/agent/payment/1")
						.content(""))
				.andExpect(status().isForbidden());
	}

	@Test
	@WithMockUser(authorities = {"ADMINISTRATOR", "AGENT"})
	public void testCustomerApiShouldBeForbiddenForOtherUser() throws Exception {
		mockMvc.perform(get("/api/customers/cars/available"))
				.andExpect(status().isForbidden());

		mockMvc.perform(post("/api/customers/booking")
						.content(""))
				.andExpect(status().isForbidden());
	}
}
