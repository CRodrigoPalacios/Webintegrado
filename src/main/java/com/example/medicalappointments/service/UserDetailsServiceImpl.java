package com.example.medicalappointments.service;

import com.example.medicalappointments.model.User;
import com.example.medicalappointments.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String dni) throws UsernameNotFoundException {
        User user = userRepository.findByDni(dni)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with dni: " + dni));

        return UserDetailsImpl.build(user);
    }

}
