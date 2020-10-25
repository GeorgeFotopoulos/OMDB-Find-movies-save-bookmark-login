package com.example.demo.controllers;

import java.util.ArrayList;
import java.util.List;

import com.example.demo.dao.BookmarkRepository;
import com.example.demo.dao.UserRepository;
import com.example.demo.model.Bookmark;
import com.example.demo.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
	static String session;

	@Autowired
	UserRepository urepo;

	@Autowired
	BookmarkRepository brepo;

	@PostMapping("/register")
	public String register(@RequestBody User user) {
		if (urepo.existsById(user.getEmail()))
			return "AlreadyExists";
		urepo.save(user);
		session = user.getEmail();
		return "Succesful";
	}

	@GetMapping("/{email}/bookmarks")
	public List<String> getBookmarks(@PathVariable String email) {
		List<Bookmark> usersBookMarks = brepo.findAll();
		List<String> bm = new ArrayList<String>();
		for (int i = 0; i < usersBookMarks.size(); i++) {
			if (usersBookMarks.get(i).getEmail().equals(email)) {
				bm.add(usersBookMarks.get(i).getOmdbID());
			}
		}
		return bm;
	}

	@PostMapping("/{email}/addBookmark")
	public String addBookmark(@PathVariable String email, @RequestBody String omdbID) {
		List<Bookmark> usersBookMarks = brepo.findAll();
		for (int i = 0; i < usersBookMarks.size(); i++) {
			if (usersBookMarks.get(i).getEmail().equals(email) && usersBookMarks.get(i).getOmdbID().equals(omdbID))
				return "AlreadyExists";
		}
		brepo.save(new Bookmark(email, omdbID));
		return "Success";
	}

	@DeleteMapping("/{email}/removeBookmark")
	public String removeBookmark(@PathVariable String email, @RequestBody String omdbID) {
		int idtodelete;
		List<Bookmark> usersBookMarks = brepo.findAll();
		for (int i = 0; i < usersBookMarks.size(); i++) {
			if (usersBookMarks.get(i).getEmail().equals(email) && usersBookMarks.get(i).getOmdbID().equals(omdbID)) {
				idtodelete = usersBookMarks.get(i).getId();
				brepo.deleteById(idtodelete);
				return "success";
			}
		}
		return ("failure");
	}

	@PostMapping("/login")
	public String login(@RequestBody User user) {
		if (urepo.existsById(user.getEmail())) {
			User ActualUser = urepo.findById(user.getEmail()).get();
			if (ActualUser.getPassword().equals(user.getPassword())) {
				session = user.getEmail();
				return "Succesful";
			} else {
				return "WrongPassword";
			}
		}
		return "NotExisting";
	}

	@GetMapping(path = "/users")
	public List<User> getUsers() {
		return (List<User>) urepo.findAll();
	}

	@GetMapping("/session/{email}")
	public String exists(@PathVariable String email) {
		if (urepo.existsById(email))
			return "true";
		return "false";
	}

	@GetMapping("/session/{session}/{movieId}")
	public String movieExists(@PathVariable String session, @PathVariable String movieId) {
		List<Bookmark> usersBookMarks = brepo.findAll();
		for (int i = 0; i < usersBookMarks.size(); i++) {
			if (usersBookMarks.get(i).getEmail().equals(session) && usersBookMarks.get(i).getOmdbID().equals(movieId))
				return "AlreadyExists";
		}
		return "tobeadded";
	}

	@GetMapping(path = "/session")
	public String getSession() {
		return session;
	}

	@DeleteMapping(path = "/logout")
	public String deleteSession() {
		session = "";
		return "Loggedout";
	}

}