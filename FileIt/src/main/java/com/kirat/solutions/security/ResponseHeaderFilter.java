package com.kirat.solutions.security;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

import com.kirat.solutions.util.WebConfigReader;

public class ResponseHeaderFilter implements Filter {

	public void doFilter(ServletRequest req, ServletResponse res,
			FilterChain chain) throws IOException, ServletException {
		 String client = WebConfigReader.getInstance().getString("client.address");
		  HttpServletResponse response = (HttpServletResponse) res;
		  response.addHeader("Access-Control-Allow-Origin", client);
	      response.addHeader("Access-Control-Allow-Headers", "origin, content-type, accept, authorization");
	      response.addHeader("Access-Control-Allow-Credentials", "true");
	      response.addHeader("Access-Control-Allow-Methods", "POST");
	      response.addHeader("Access-Control-Max-Age", "60");
	      
	      // Headers Set for Additional Security
	      response.addHeader("Strict-Transport-Security", "max-age=16070400; includeSubDomains");
	      response.addHeader("X-XSS-Protection", "1; mode=block");
	      response.addHeader("X-Frame-Options", "deny");
	      response.addHeader("X-Content-Type-Options", "nosniff");
	      response.addHeader("X-WebKit-CSP", "default-src *");
	      response.addHeader("Cache-Control","no-store, no-cache, must-revalidate");
	      
		  // pass the request/response on
		  chain.doFilter(req, response);
		  
		  String contentType = req.getContentType();
	      if (null!=contentType && !contentType.isEmpty()) {
	    	  if (!contentType.contains("charset")) {
	    		  contentType = contentType + ";charset=utf-8";
	    		  response.addHeader("Content-Type", contentType);
	    	  }
	      }
	}

	public void destroy() {
	}

	public void init(FilterConfig fc) throws ServletException {
	}
}
