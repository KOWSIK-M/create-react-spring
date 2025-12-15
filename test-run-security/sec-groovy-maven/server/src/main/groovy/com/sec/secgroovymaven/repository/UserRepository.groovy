package com.sec.secgroovymaven.repository

import com.sec.secgroovymaven.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email)
}
