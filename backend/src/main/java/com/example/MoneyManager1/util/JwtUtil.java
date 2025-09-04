package com.example.MoneyManager1.util;



import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtUtil {

    // The secret key from your application.properties file.
    private final String secretString = "Zb8e7c7e4e2a-4b1a-9c2e-8f7e2d3c4b5a";

    // Creates a secure, modern key object for both signing and parsing.
    private final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(secretString.getBytes(StandardCharsets.UTF_8));

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // This method now uses the modern, non-deprecated way to parse and validate the token.
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(userDetails.getUsername());
    }

    // This method now uses the proper SecretKey object to sign the token.
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // Inside JwtUtil.java
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);

        // USE THIS NEW DEBUG LINE
        System.out.println("DEBUG: Token User: '" + username + "' (Length: " + username.length() + ")");
        System.out.println("DEBUG: DB User:    '" + userDetails.getUsername() + "' (Length: " + userDetails.getUsername().length() + ")");

        // USE THIS SAFER COMPARISON
        return (username.trim().equalsIgnoreCase(userDetails.getUsername().trim()) && !isTokenExpired(token));
    }
}