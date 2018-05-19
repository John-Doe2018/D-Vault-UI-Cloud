package com.kirat.solutions.util;

import java.io.IOException;
import java.io.InputStream;
import java.text.MessageFormat;
import java.util.Hashtable;
import java.util.Map;
import java.util.Properties;


/**
 * <p> WebConfigReader - This class reads web configurations <p>
 */
public final class WebConfigReader {
	/*private static final IPOSLogger OLOGGER = POSLoggerFactory.getLogger(
			LoggerConstant.POS_LOG, WebConfigReader.class); */
	
	private static Map<String, String> propertyMap = new Hashtable<String, String>();

	/**
	 * <p>
	 * Constructor Desc.
	 * <p>
	 *
	 * 
	 */
	private WebConfigReader() {
		Properties properties = new Properties();
		InputStream inputStream = getClass().getClassLoader()
				.getResourceAsStream("properties/web-config.properties");

		try {
			if (null != inputStream) {
				properties.load(inputStream);
			}
			// step-1: reading property and putting in map
			for (String key : properties.stringPropertyNames()) {
				String value = properties.getProperty(key);
				propertyMap.put(key, value);
			}

		} catch (IOException ioException) {
			//OLOGGER.error(ioException.toString());
		}
		finally{
			if(null != inputStream){
				try{
					inputStream.close();
				} catch (IOException e) {
					//LOGGER.error("Getting Exception "+e.getMessage());
				}
			}
		}

	}

	private static class LazyLoader {
		// step-2: Bill pugh singleton solution
		private static final WebConfigReader INSTANCE = new WebConfigReader();
	}

	/**
	 * <p>
	 * Method Desc.
	 * <p>
	 *
	 * @return
	 */
	public static WebConfigReader getInstance() {
		return LazyLoader.INSTANCE;
	}

	/**
	 * <p>
	 * Method Desc.
	 * <p>
	 *
	 * @param key
	 * @return
	 */
	public String getString(String key) {
		return propertyMap.get(key);
	}

	/**
	 * <p>
	 * Formats a property string value by using parameters
	 * <p>
	 *
	 * @param key
	 *            the property key
	 * @param params
	 *            values for the property string parameters
	 * @return formatted string
	 */
	public String getString(String key, Object... params) {
		String message = propertyMap.get(key);
		return MessageFormat.format(message, params);
	}

}
