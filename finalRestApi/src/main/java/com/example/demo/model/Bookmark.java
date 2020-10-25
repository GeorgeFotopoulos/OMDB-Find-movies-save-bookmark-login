package com.example.demo.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Bookmark {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	int id;
	String email;
	String omdbID;

	public Bookmark(String email, String omdbID) {
		this.email = email;
		this.omdbID = omdbID;
	}

	public Bookmark() {
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getOmdbID() {
		return omdbID;
	}

	public void setOmdbID(String omdbID) {
		this.omdbID = omdbID;
	}

}
