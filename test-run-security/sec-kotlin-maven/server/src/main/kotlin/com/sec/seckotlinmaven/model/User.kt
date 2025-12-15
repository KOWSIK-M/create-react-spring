package com.sec.seckotlinmaven.model

import jakarta.persistence.*

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,
    
    @Column(nullable = false)
    var name: String = "",
    
    @Column(unique = true, nullable = false)
    var email: String = ""
)
